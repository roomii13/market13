export type UserRole = 'admin' | 'prestador' | 'contratante';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  telefono?: string;
  createdAt: string;
  ubicacion?: string;
  verificado?: boolean;
  rating_promedio?: number;
  total_resenas?: number;
  antecedentes_penales_url?: string;
  documento_identidad_url?: string;
  foto_perfil_url?: string;
  facial_verificado?: boolean;
}

export interface Solicitud {
  id: string;
  servicioId: string;
  servicioNombre: string;
  contratanteId: string;
  contratanteNombre: string;
  prestadorId: string;
  prestadorNombre: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'completada' | 'cancelada';
  fecha: string;
  fecha_aceptacion?: string;
  fecha_completacion?: string;
  mensaje: string;
  imagenes?: string[];
  ubicacion?: string;
  precio_acordado?: number;
  calificacion?: number;
  comentario_calificacion?: string;
}

export interface TrabajoRealizado {
  id: string;
  servicioId: string;
  prestadorId: string;
  titulo?: string;
  imagenUrl: string;
  descripcion: string;
  fecha: string;
  visible?: boolean;
}

export interface MensajeChat {
  id: string;
  solicitudId: string;
  remitenteId: string;
  destinatarioId: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  tipo?: 'texto' | 'imagen' | 'documento';
  archivo_url?: string;
}

export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioTipo: 'hora' | 'dia' | 'proyecto' | 'unidad'; 
  categoria: string;
  prestadorId: string;
  prestadorNombre: string;
  imagenes: string[];
  disponibilidad: {
    lunes: { inicio: string, fin: string }[];
    martes: { inicio: string, fin: string }[];
    miercoles: { inicio: string, fin: string }[];
    jueves: { inicio: string, fin: string }[];
    viernes: { inicio: string, fin: string }[];
    sabado: { inicio: string, fin: string }[];
    domingo?: { inicio: string, fin: string }[];
  };
  ubicacion?: string;
  calificacion: number;
  reseñas: number;
  disponible: boolean;
  createdAt: string;
}

// ========== CONSTANTES Y DATOS POR DEFECTO (LOCALSTORAGE) ==========
const USERS_KEY = 'pampapro_users';
const CURRENT_USER_KEY = 'pampapro_current_user';
const SERVICES_KEY = 'pampapro_services';
const SOLICITUDES_KEY = 'pampapro_solicitudes';

export const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@pampapro.com',
    nombre:'Romina' ,
    apellido: 'Administradora',
    rol: 'admin',
    telefono: '+54 2954 446198',
    createdAt: new Date().toISOString(),
    verificado: true,
    facial_verificado: true
  },
  {
    id: '2',
    email: 'prestador@pampapro.com',
    nombre: 'María',
    apellido: 'González',
    rol: 'prestador',
    telefono: '+54 11 2345-6789',
    createdAt: new Date().toISOString(),
    verificado: true,
    rating_promedio: 4.7
  },
  {
    id: '3',
    email: 'contratante@pampapro.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'contratante',
    telefono: '+54 11 3456-7890',
    createdAt: new Date().toISOString(),
    verificado: true
  },
];

export const defaultServices: Service[] = [
  // ... (mantener servicios actuales)
];

// ========== FUNCIONES HÍBRIDAS ==========

/**
 * Configuración para determinar si usamos backend o localStorage
 */
const USE_BACKEND = process.env.NEXT_PUBLIC_USE_BACKEND === 'true';

/**
 * Inicializa datos dependiendo del modo
 */
export function initializeData() {
  if (typeof window === 'undefined') return;
  
  // Solo inicializar localStorage si no estamos usando backend
  if (!USE_BACKEND) {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
    
    const services = localStorage.getItem(SERVICES_KEY);
    if (!services) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
    }
    
    const solicitudes = localStorage.getItem(SOLICITUDES_KEY);
    if (!solicitudes) {
      localStorage.setItem(SOLICITUDES_KEY, JSON.stringify([]));
    }
  }
}

/**
 * Obtiene el usuario actual desde localStorage o backend
 */
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  
  if (USE_BACKEND) {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  } else {
    // Modo localStorage
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}

/**
 * Login - Intenta con backend, falla a localStorage
 */
export async function login(email: string, password: string): Promise<User | null> {
  if (USE_BACKEND) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        // Fallback a localStorage si el backend falla
        console.warn('Backend falló, usando localStorage');
        return loginLocal(email, password);
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error en login con backend:', error);
      return loginLocal(email, password);
    }
  } else {
    return loginLocal(email, password);
  }
}

/**
 * Login con localStorage (fallback)
 */
function loginLocal(email: string, password: string): User | null {
  const users = getUsersLocal();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Contraseña hardcodeada para demo
  if (user && password === '123456') {
    setCurrentUserLocal(user);
    return user;
  }
  return null;
}

/**
 * Registro - Intenta con backend, falla a localStorage
 */
export async function register(userData: any): Promise<User> {
  if (USE_BACKEND) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          password: '123456',
          confirmPassword: '123456'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en registro');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error en registro con backend:', error);
      // Fallback a localStorage
      return registerLocal(userData);
    }
  } else {
    return registerLocal(userData);
  }
}

/**
 * Registro con localStorage (fallback)
 */
function registerLocal(userData: any): User {
  const users = getUsersLocal();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setCurrentUserLocal(newUser);
  return newUser;
}

/**
 * Logout - Limpia sesión en ambos lados
 */
export async function logout() {
  if (USE_BACKEND) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error en logout con backend:', error);
    }
  }
  
  // Siempre limpiar localStorage
  setCurrentUserLocal(null);
}

// ========== FUNCIONES DE LOCALSTORAGE (PARA COMPATIBILIDAD) ==========

export function getUsersLocal(): User[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function setCurrentUserLocal(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getServicesLocal(): Service[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SERVICES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addServiceLocal(service: Omit<Service, 'id'>): Service {
  const services = getServicesLocal();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
  };
  services.push(newService);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  return newService;
}

export function updateServiceLocal(id: string, updates: Partial<Service>) {
  const services = getServicesLocal();
  const index = services.findIndex(s => s.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  }
}

export function deleteServiceLocal(id: string) {
  const services = getServicesLocal().filter(s => s.id !== id);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function getSolicitudesLocal(): Solicitud[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SOLICITUDES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addSolicitudLocal(solicitud: Omit<Solicitud, 'id' | 'fecha'>): Solicitud {
  const solicitudes = getSolicitudesLocal();
  const newSolicitud: Solicitud = {
    ...solicitud,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
  };
  solicitudes.push(newSolicitud);
  localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));
  return newSolicitud;
}

export function updateSolicitudLocal(id: string, updates: Partial<Solicitud>) {
  const solicitudes = getSolicitudesLocal();
  const index = solicitudes.findIndex(s => s.id === id);
  if (index !== -1) {
    solicitudes[index] = { ...solicitudes[index], ...updates };
    localStorage.setItem(SOLICITUDES_KEY, JSON.stringify(solicitudes));
  }
}

// ========== FUNCIONES PARA EL FRONTEND (ABSTRACCIÓN) ==========

/**
 * Obtener servicios - Decide según USE_BACKEND
 
export async function getServices(): Promise<Service[]> {
  if (USE_BACKEND) {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        return await response.json();
      }
      return getServicesLocal();
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      return getServicesLocal();
    }
  } else {
    return getServicesLocal();
  }
}

/**
 * Agregar servicio - Decide según USE_BACKEND
 
export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  if (USE_BACKEND) {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error agregando servicio');
    } catch (error) {
      console.error('Error agregando servicio:', error);
      return addServiceLocal(service);
    }
  } else {
    return addServiceLocal(service);
  }
}

/**
 * Verificación facial - Solo backend
 */
export async function verifyFace(formData: FormData): Promise<any> {
  try {
    const response = await fetch('/api/verification', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Error en verificación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en verificación facial:', error);
    throw error;
  }
}

/**
 * Subir antecedentes penales - Solo backend
 */
export async function uploadAntecedentesPenales(file: File, userId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tipo', 'certificado');
  formData.append('userId', userId);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Error subiendo archivo');
    }
    
    const data = await response.json();
    
    // Actualizar usuario con la URL del certificado
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        antecedentes_penales_url: data.url
      })
    });
    
    return data.url;
  } catch (error) {
    console.error('Error subiendo antecedentes:', error);
    throw error;
  }
}

/**
 * Helper para verificar si el backend está disponible
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', { 
      method: 'GET',
      cache: 'no-store'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Inicializar aplicación detectando modo automáticamente
 */
export async function initializeApp() {
  if (typeof window === 'undefined') return;
  
  // Verificar si el backend está disponible
  const backendAvailable = await checkBackendStatus();
  
  if (backendAvailable && !USE_BACKEND) {
    console.log('✅ Backend disponible, migrando datos...');
    await migrateLocalDataToBackend();
  } else if (!backendAvailable && USE_BACKEND) {
    console.warn('⚠️ Backend no disponible, usando localStorage');
    // Podrías mostrar una notificación al usuario
  }
  
  initializeData();
}

/**
 * Migrar datos de localStorage al backend
 */
async function migrateLocalDataToBackend() {
  try {
    const users = getUsersLocal();
    const services = getServicesLocal();
    const solicitudes = getSolicitudesLocal();
    
    // Migrar usuarios
    for (const user of users) {
      if (user.email !== 'admin@pampapro.com') {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            password: '123456',
            confirmPassword: '123456',
            rol: user.rol,
            telefono: user.telefono
          })
        });
      }
    }
    
    console.log('✅ Datos migrados al backend');
  } catch (error) {
    console.error('Error migrando datos:', error);
  }
}

// Exportar funciones con nombres compatibles
export {
  getServicesLocal as getServices,
  addServiceLocal as addService,
  updateServiceLocal as updateService,
  deleteServiceLocal as deleteService,
  getSolicitudesLocal as getSolicitudes,
  addSolicitudLocal as addSolicitud,
  updateSolicitudLocal as updateSolicitud,
  getUsersLocal as getUsers,
  updateUser as updateUserLocal,
  deleteUser as deleteUserLocal
};