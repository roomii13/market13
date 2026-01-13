'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, Shield, ArrowRight, CheckCircle, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser, User, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []); // Solo se ejecuta al montar el componente

  const handleLogout = () => {
    logout();
    setUser(null);
    router.refresh();
  };

  // Si hay usuario, mostrar versión logueada
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-primary">PampaPro</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-right hidden sm:block">
                  <p className="font-medium">Hola, {user.nombre}!</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.rol}</p>
                </div>
                <Link href="/panel">
                  <Button>Ir al Panel</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bienvenido de nuevo a <span className="text-primary">PampaPro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ya estás logueado. ¿Qué deseas hacer?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit mb-4">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Ir al Dashboard</CardTitle>
                <CardDescription>Accede a tu panel principal</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/panel">
                  <Button className="w-full">
                    Ver mi panel <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {user.rol === 'contratante' && (
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
                    <Briefcase className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Buscar Servicios</CardTitle>
                  <CardDescription>Encuentra lo que necesitas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/panel/servicios">
                    <Button className="w-full" variant="outline">
                      Explorar servicios
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {user.rol === 'prestador' && (
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-purple-100 p-4 rounded-full w-fit mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Mis Servicios</CardTitle>
                  <CardDescription>Gestiona tus publicaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/panel/mis-servicios">
                    <Button className="w-full" variant="outline">
                      Administrar servicios
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-amber-100 p-4 rounded-full w-fit mb-4">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Solicitudes</CardTitle>
                <CardDescription>Revisa tu actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/panel/solicitudes">
                  <Button className="w-full" variant="secondary">
                    Ver solicitudes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">¿O prefieres explorar como invitado?</p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </section>

        {/* Credenciales de prueba */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Credenciales de prueba</h2>
              <p className="mb-6 opacity-90">Usa estas credenciales para probar otros roles (contraseña: 123456)</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold">Administrador</p>
                  <p className="text-sm opacity-90">admin@pampapro.com</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold">Prestador de Servicios</p>
                  <p className="text-sm opacity-90">prestador@pampapro.com</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold">Contratante</p>
                  <p className="text-sm opacity-90">contratante@pampapro.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase className="h-5 w-5" />
              <span className="font-bold">PampaPro</span>
            </div>
            <p className="text-gray-400">2025 PampaPro. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Si NO hay usuario, mostrar versión normal (sin loguear)
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-primary">PampaPro</span>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            La plataforma de servicios profesionales para <span className="text-primary">La Pampa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos prestadores de servicios con contratantes de manera rápida, segura y profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Para Contratantes</CardTitle>
                <CardDescription>Encuentra el servicio que necesitas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Busca servicios por categoría
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Compara precios y calificaciones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Contrata de forma segura
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Para Prestadores</CardTitle>
                <CardDescription>Ofrece tus servicios profesionales</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Publica tus servicios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Recibe solicitudes de clientes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Gestiona tu agenda
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Transacciones protegidas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Verificación de usuarios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Sistema de calificaciones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> 
                    Soporte 24/7
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Credenciales de prueba</h2>
            <p className="mb-6 opacity-90">Usa estas credenciales para probar la aplicación (contraseña: 123456)</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">Administrador</p>
                <p className="text-sm opacity-90">admin@pampapro.com</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">Prestador de Servicios</p>
                <p className="text-sm opacity-90">prestador@pampapro.com</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-semibold">Contratante</p>
                <p className="text-sm opacity-90">contratante@pampapro.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="h-5 w-5" />
            <span className="font-bold">PampaPro</span>
          </div>
          <p className="text-gray-400">2025 PampaPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}