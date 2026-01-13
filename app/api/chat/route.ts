import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mensajes_chat, solicitudes, users } from '@/lib/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    // Obtener usuario actual desde middleware
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const solicitudId = searchParams.get('solicitudId');
    const destinatarioId = searchParams.get('destinatarioId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!solicitudId && !destinatarioId) {
      return NextResponse.json(
        { error: 'Se requiere solicitudId o destinatarioId' },
        { status: 400 }
      );
    }
    
    let query = db.select()
      .from(mensajes_chat)
      .where(
        solicitudId 
          ? eq(mensajes_chat.solicitud_id, solicitudId)
          : and(
              eq(mensajes_chat.remitente_id, currentUser.id),
              eq(mensajes_chat.destinatario_id, destinatarioId!)
            )
      )
      .orderBy(desc(mensajes_chat.fecha))
      .limit(limit)
      .offset(offset);
    
    const mensajes = await query;
    
    // Marcar mensajes como leídos
    if (mensajes.length > 0) {
      const unreadMessageIds = mensajes
        .filter(m => !m.leido && m.destinatario_id === currentUser.id)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        await db.update(mensajes_chat)
          .set({ leido: true })
          .where(eq(mensajes_chat.id, unreadMessageIds[0])); // Para múltiples usar 'in'
      }
    }
    
    return NextResponse.json({
      success: true,
      mensajes: mensajes.reverse(), // Ordenar cronológicamente
      total: mensajes.length,
      hasMore: mensajes.length === limit
    });
    
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { solicitudId, destinatarioId, contenido, tipo = 'texto', archivoUrl } = body;
    
    // Validar que el usuario tenga permiso para enviar en esta solicitud
    const solicitud = await db.query.solicitudes.findFirst({
      where: eq(solicitudes.id, solicitudId)
    });
    
    if (!solicitud) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario sea parte de la solicitud
    const isPartOfSolicitud = 
      currentUser.id === solicitud.contratante_id || 
      currentUser.id === solicitud.prestador_id;
    
    if (!isPartOfSolicitud) {
      return NextResponse.json(
        { error: 'No tienes permiso para enviar mensajes en esta conversación' },
        { status: 403 }
      );
    }
    
    // Crear mensaje
    const messageId = crypto.randomUUID();
    const nuevoMensaje = {
      id: messageId,
      solicitud_id: solicitudId,
      remitente_id: currentUser.id,
      destinatario_id: destinatarioId,
      contenido,
      tipo,
      archivo_url: archivoUrl || null,
      fecha: new Date().toISOString(),
      leido: false
    };
    
    await db.insert(mensajes_chat).values(nuevoMensaje);
    
    // integrar WebSocket para notificaciones en tiempo real
    // broadcastMessage(nuevoMensaje);
    
    return NextResponse.json({
      success: true,
      mensaje: nuevoMensaje
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}