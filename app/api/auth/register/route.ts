import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema de validación
const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto'),
  apellido: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  rol: z.enum(['prestador', 'contratante']),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos
    const validatedData = registerSchema.parse(body);
    
    // Verificar si el usuario ya existe
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, validatedData.email)
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      );
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Crear usuario
    const userId = crypto.randomUUID();
    const newUser = {
      id: userId,
      email: validatedData.email,
      password: hashedPassword,
      nombre: validatedData.nombre,
      apellido: validatedData.apellido,
      rol: validatedData.rol,
      telefono: validatedData.telefono || null,
      verificado: false,
      createdAt: new Date().toISOString()
    };
    
    await db.insert(users).values(newUser);
    
    // Crear sesión (JWT o cookie)
    const token = await createSessionToken(userId);
    
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        rol: newUser.rol,
        telefono: newUser.telefono
      },
      token,
      nextSteps: validatedData.rol === 'prestador' 
        ? 'Complete su verificación como prestador' 
        : '¡Registro completado!'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function createSessionToken(userId: string): Promise<string> {
  // Implementar JWT 
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, // 7 días
    process.env.JWT_SECRET!
  );
}