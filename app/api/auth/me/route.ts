import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser as getCurrentUserFromMiddleware } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromMiddleware(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
        telefono: user.telefono,
        verificado: user.verificado,
        facial_verificado: user.facial_verificado,
        rating_promedio: user.rating_promedio,
        ubicacion: user.ubicacion
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}