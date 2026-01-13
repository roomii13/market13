import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verificaciones_faciales, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadToS3 } from '@/lib/upload'; // Implementar después

// Configurar proveedor de reconocimiento facial
const FACE_API_PROVIDER = process.env.FACE_API_PROVIDER || 'azure';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const documentoFrontal = formData.get('documentoFrontal') as File;
    const selfie = formData.get('selfie') as File;
    const documentoReverso = formData.get('documentoReverso') as File;
    
    // Verificar usuario
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Subir imágenes a almacenamiento seguro
    const [docFrontalUrl, selfieUrl, docReversoUrl] = await Promise.all([
      uploadToS3(documentoFrontal, `verificaciones/${userId}/documento-frontal`),
      uploadToS3(selfie, `verificaciones/${userId}/selfie`),
      documentoReverso 
        ? uploadToS3(documentoReverso, `verificaciones/${userId}/documento-reverso`)
        : Promise.resolve(null)
    ]);
    
    // Procesar con API de reconocimiento facial
    const verificationResult = await processFacialVerification({
      documentoFrontalUrl: docFrontalUrl,
      selfieUrl: selfieUrl,
      provider: FACE_API_PROVIDER
    });
    
    // Guardar resultado de verificación
    const verificationId = crypto.randomUUID();
    await db.insert(verificaciones_faciales).values({
      id: verificationId,
      user_id: userId,
      documento_frontal_url: docFrontalUrl,
      documento_reverso_url: docReversoUrl,
      selfie_url: selfieUrl,
      similitud_score: verificationResult.similarity,
      liveness_score: verificationResult.liveness,
      estado: verificationResult.approved ? 'aprobada' : 'revision',
      provider: FACE_API_PROVIDER,
      metadata: JSON.stringify(verificationResult.metadata)
    });
    
    // Actualizar estado del usuario si fue aprobado
    if (verificationResult.approved) {
      await db.update(users)
        .set({ 
          verificado: true,
          facial_verificado: true,
          updatedAt: new Date().toISOString()
        })
        .where(eq(users.id, userId));
    }
    
    return NextResponse.json({
      success: true,
      verificationId,
      approved: verificationResult.approved,
      similarity: verificationResult.similarity,
      liveness: verificationResult.liveness,
      nextStep: verificationResult.approved 
        ? 'Verificación completada' 
        : 'En revisión manual'
    });
    
  } catch (error) {
    console.error('Error en verificación facial:', error);
    return NextResponse.json(
      { error: 'Error en el proceso de verificación' },
      { status: 500 }
    );
  }
}

// Función para procesar con Azure Face API
async function processFacialVerification(params: {
  documentoFrontalUrl: string;
  selfieUrl: string;
  provider: string;
}) {
  if (params.provider === 'azure') {
    return await verifyWithAzureFaceAPI(params);
  }
  
  // Implementar otros proveedores
  throw new Error(`Proveedor ${params.provider} no implementado`);
}

async function verifyWithAzureFaceAPI(params: {
  documentoFrontalUrl: string;
  selfieUrl: string;
}) {
  const endpoint = process.env.AZURE_FACE_ENDPOINT!;
  const key = process.env.AZURE_FACE_KEY!;
  
  // 1. Detectar rostro en documento
  const face1Response = await fetch(`${endpoint}/face/v1.0/detect`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: params.documentoFrontalUrl
    })
  });
  
  const faces1 = await face1Response.json();
  if (!faces1[0]) {
    throw new Error('No se detectó rostro en el documento');
  }
  
  // 2. Detectar rostro en selfie
  const face2Response = await fetch(`${endpoint}/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&detectionModel=detection_03&returnFaceAttributes=age,gender,smile,facialHair,headPose,glasses,emotion,blur,exposure,noise,qualityForRecognition`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: params.selfieUrl
    })
  });
  
  const faces2 = await face2Response.json();
  if (!faces2[0]) {
    throw new Error('No se detectó rostro en el selfie');
  }
  
  // Verificar calidad de imagen
  const quality = faces2[0].faceAttributes.qualityForRecognition;
  if (quality === 'low') {
    return {
      approved: false,
      similarity: 0,
      liveness: 0,
      metadata: { error: 'Calidad de imagen baja' }
    };
  }
  
  // 3. Comparacion
  const verifyResponse = await fetch(`${endpoint}/face/v1.0/verify`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      faceId1: faces1[0].faceId,
      faceId2: faces2[0].faceId
    })
  });
  
  const verificationResult = await verifyResponse.json();
  
  return {
    approved: verificationResult.confidence > 0.7, // Threshold ajustable
    similarity: verificationResult.confidence,
    liveness: faces2[0].faceAttributes.blur.blurLevel === 'low' ? 0.9 : 0.5,
    metadata: {
      face1: faces1[0],
      face2: faces2[0],
      verification: verificationResult
    }
  };
}