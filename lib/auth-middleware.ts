import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: number | null;
  ubicacion: string;
  rating_promedio: number | null;
  rol: string;
  verificado: boolean;
  facial_verificado: boolean;
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // 1. Verificar token en cookies
    const token = request.cookies.get('auth_token')?.value;
    
    // 2. también en headers (para API calls)
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    
    const finalToken = token || bearerToken;
    
    if (!finalToken) {
      return null;
    }
    
    // 3. Verificar JWT
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET!) as { userId: string };
    
    // 4. Obtener usuario de la base de datos
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
      columns: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        verificado: true,
        facial_verificado: true,
        telefono: true,
        ubicacion: true,
        rating_promedio: true
      }
    });
    
    return user || null;
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    return handler(request, user, ...args);
  };
}

export function requireRole(roles: string[]) {
  return function decorator(handler: Function) {
    return async (request: NextRequest, user: AuthUser, ...args: any[]) => {
      if (!roles.includes(user.rol)) {
        return Response.json(
          { error: 'No tienes permisos para esta acción' },
          { status: 403 }
        );
      }
      
      return handler(request, user, ...args);
    };
  };
}