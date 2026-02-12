import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Para desarrollo local con SQLite
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./pampapro.db'
});

export const db = drizzle(client, { schema });

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    // Verificar si las tablas existen, si no, crearlas
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    if (tables.length === 0) {
      console.log('🔄 Creando tablas de la base de datos...');
      
      // Crear tablas con Drizzle
      // En producción usar migraciones
      
      // Insertar datos por defecto
      await seedDatabase();
    }
    
    return db;
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  }
}

async function seedDatabase() {
  // Insertar usuarios por defecto
  const defaultUsers = [
    {
      id: '1',
      email: 'admin@pampapro.com',
      password: await hashPassword('123456'), // Implementar hash después
      nombre: 'Romina',
      apellido: 'Administradora',
      rol: 'admin',
      telefono: '+54 2954 446198',
      verificado: true,
      facial_verificado: true
    },
    {
      id: '2',
      email: 'prestador@pampapro.com',
      password: await hashPassword('123456'),
      nombre: 'María',
      apellido: 'González',
      rol: 'prestador',
      telefono: '+54 11 2345-6789',
      verificado: true,
      rating_promedio: 4.7
    },
    {
      id: '3',
      email: 'contratante@pampapro.com',
      password: await hashPassword('123456'),
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'contratante',
      telefono: '+54 11 3456-7890',
      verificado: true
    }
  ];
  
  // Insertar servicios por defecto
  const defaultServices = [
    {
      id: '1',
      nombre: 'Limpieza del Hogar',
      descripcion: 'Servicio completo de limpieza para casas y departamentos.',
      precio: 15000,
      precio_tipo: 'proyecto',
      categoria: 'Limpieza',
      prestador_id: '2',
      ubicacion: 'Buenos Aires, Argentina',
      disponibilidad: JSON.stringify({
        lunes: [{ inicio: '08:00', fin: '18:00' }],
        martes: [{ inicio: '08:00', fin: '18:00' }],
        miercoles: [{ inicio: '08:00', fin: '18:00' }],
        jueves: [{ inicio: '08:00', fin: '18:00' }],
        viernes: [{ inicio: '08:00', fin: '18:00' }],
        sabado: [{ inicio: '09:00', fin: '14:00' }]
      }),
      imagenes: JSON.stringify([
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1574781330858-1d8eb6d71e8c?auto=format&fit=crop&w-800'
      ]),
      calificacion: 4.8,
      reseñas: 24,
      disponible: true
    }
    //se podrían agregar más servicios acá
  ];
  
  // Insertar datos
  for (const user of defaultUsers) {
    await db.insert(schema.users).values(user).onConflictDoNothing();
  }
  
  for (const service of defaultServices) {
    await db.insert(schema.services).values(service).onConflictDoNothing();
  }
  
  console.log('✅ Base de datos inicializada con datos por defecto');
}

// Función helper para hashear contraseñas
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}