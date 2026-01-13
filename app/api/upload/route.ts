import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-middleware';

// Tipos de archivos permitidos
const ALLOWED_TYPES = {
  imagen: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documento: ['application/pdf', 'application/msword', 'text/plain'],
  certificado: ['application/pdf', 'image/jpeg', 'image/png']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tipo = formData.get('tipo') as keyof typeof ALLOWED_TYPES || 'imagen';
    
    // Validaciones
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Archivo demasiado grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    
    if (!ALLOWED_TYPES[tipo]?.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido para ${tipo}` },
        { status: 400 }
      );
    }
    
    // Generar nombre único
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomBytes(16).toString('hex')}.${fileExtension}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    
    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Guardar archivo (en producción usar S3, Cloud Storage, etc.)
    await writeFile(filePath, buffer);
    
    // Guardar registro en base de datos
    const uploadId = crypto.randomUUID();
    await db.insert(uploads).values({
      id: uploadId,
      user_id: currentUser.id,
      file_name: fileName,
      original_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_path: `/uploads/${fileName}`,
      tipo,
      uploaded_at: new Date().toISOString()
    });
    
    // URL pública
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/uploads/${fileName}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      fileType: file.type,
      fileSize: file.size,
      uploadId
    });
    
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}