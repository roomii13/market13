import { sql } from 'drizzle-orm';
import { integer, text, real, blob } from 'drizzle-orm/sqlite-core';
import { createTable } from './base';

// Tabla de usuarios
export const users = createTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  nombre: text('nombre').notNull(),
  apellido: text('apellido').notNull(),
  rol: text('rol', { enum: ['admin', 'prestador', 'contratante'] }).notNull(),
  telefono: text('telefono'),
  ubicacion: text('ubicacion'),
  verificado: integer('verificado', { mode: 'boolean' }).default(false),
  
  // Campos para prestadores
  antecedentes_penales_url: text('antecedentes_penales_url'),
  documento_identidad_url: text('documento_identidad_url'),
  foto_perfil_url: text('foto_perfil_url'),
  rating_promedio: real('rating_promedio').default(0),
  total_resenas: integer('total_resenas').default(0),
  
  // Campos de verificación facial
  facial_embedding: blob('facial_embedding'), // Embeddings codificados
  facial_verificado: integer('facial_verificado', { mode: 'boolean' }).default(false),
  
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de servicios
export const services = createTable('services', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion').notNull(),
  precio: real('precio').notNull(),
  precio_tipo: text('precio_tipo', { 
    enum: ['hora', 'dia', 'proyecto', 'unidad'] 
  }).notNull(),
  categoria: text('categoria').notNull(),
  prestador_id: text('prestador_id')
    .notNull()
    .references(() => users.id),
  ubicacion: text('ubicacion'),
  
  // Disponibilidad (almacenado como JSON)
  disponibilidad: text('disponibilidad', { mode: 'json' }).notNull(),
  
  // Imágenes (almacenado como JSON array)
  imagenes: text('imagenes', { mode: 'json' }).notNull(),
  
  calificacion: real('calificacion').default(0),
  reseñas: integer('reseñas').default(0),
  disponible: integer('disponible', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de solicitudes
export const solicitudes = createTable('solicitudes', {
  id: text('id').primaryKey(),
  servicio_id: text('servicio_id')
    .notNull()
    .references(() => services.id),
  servicio_nombre: text('servicio_nombre').notNull(),
  contratante_id: text('contratante_id')
    .notNull()
    .references(() => users.id),
  contratante_nombre: text('contratante_nombre').notNull(),
  prestador_id: text('prestador_id')
    .notNull()
    .references(() => users.id),
  prestador_nombre: text('prestador_nombre').notNull(),
  estado: text('estado', { 
    enum: ['pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada'] 
  }).default('pendiente'),
  fecha_solicitud: text('fecha_solicitud').default(sql`(CURRENT_TIMESTAMP)`),
  fecha_aceptacion: text('fecha_aceptacion'),
  fecha_completacion: text('fecha_completacion'),
  mensaje: text('mensaje').notNull(),
  ubicacion: text('ubicacion'),
  precio_acordado: real('precio_acordado'),
  
  // Imágenes (opcional)
  imagenes: text('imagenes', { mode: 'json' }),
  
  // Calificación después de completado
  calificacion: integer('calificacion'),
  comentario_calificacion: text('comentario_calificacion'),
  
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de chat
export const mensajes_chat = createTable('mensajes_chat', {
  id: text('id').primaryKey(),
  solicitud_id: text('solicitud_id')
    .notNull()
    .references(() => solicitudes.id),
  remitente_id: text('remitente_id')
    .notNull()
    .references(() => users.id),
  destinatario_id: text('destinatario_id')
    .notNull()
    .references(() => users.id),
  contenido: text('contenido').notNull(),
  fecha: text('fecha').default(sql`(CURRENT_TIMESTAMP)`),
  leido: integer('leido', { mode: 'boolean' }).default(false),
  
  // Para mensajes con archivos
  tipo: text('tipo', { enum: ['texto', 'imagen', 'documento'] }).default('texto'),
  archivo_url: text('archivo_url'),
  
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de trabajos realizados (prestadores)
export const trabajos_realizados = createTable('trabajos_realizados', {
  id: text('id').primaryKey(),
  servicio_id: text('servicio_id')
    .notNull()
    .references(() => services.id),
  prestador_id: text('prestador_id')
    .notNull()
    .references(() => users.id),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  imagen_url: text('imagen_url').notNull(),
  fecha: text('fecha').default(sql`(CURRENT_TIMESTAMP)`),
  visible: integer('visible', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de reseñas
export const reseñas = createTable('reseñas', {
  id: text('id').primaryKey(),
  solicitud_id: text('solicitud_id')
    .unique()
    .references(() => solicitudes.id),
  prestador_id: text('prestador_id')
    .notNull()
    .references(() => users.id),
  contratante_id: text('contratante_id')
    .notNull()
    .references(() => users.id),
  calificacion: integer('calificacion').notNull(), // 1-5
  comentario: text('comentario'),
  fecha: text('fecha').default(sql`(CURRENT_TIMESTAMP)`)
});

// Tabla de verificación facial
export const verificaciones_faciales = createTable('verificaciones_faciales', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id),
  
  // Datos de la verificación
  documento_frontal_url: text('documento_frontal_url').notNull(),
  documento_reverso_url: text('documento_reverso_url'),
  selfie_url: text('selfie_url').notNull(),
  
  // Resultados de la comparación
  similitud_score: real('similitud_score'),
  liveness_score: real('liveness_score'),
  
  // Estado
  estado: text('estado', { 
    enum: ['pendiente', 'aprobada', 'rechazada', 'revision'] 
  }).default('pendiente'),
  
  // Metadatos
  provider: text('provider'), // 'azure'
  metadata: text('metadata', { mode: 'json' }),
  
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`)
});