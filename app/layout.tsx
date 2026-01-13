'use client';
import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { initializeData, getCurrentUser, logout, User } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Home, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    initializeData();
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) setUser(getCurrentUser());
  }, [pathname, mounted]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/registro';
  const isHomePage = pathname === '/';

  if (!mounted) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-lg">Cargando...</div>
              {children}
            <Toaster richColors position="top-right" />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <head>
        <title>PampaPro - Servicios Profesionales</title>
      </head>
      <body className={inter.className}>
        {user && !isAuthPage && !isHomePage && (
          <header className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center gap-2">
                  <div className="bg-primary text-white p-2 rounded-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-xl text-primary">PampaPro</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/panel" className="text-gray-600 hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" /> Panel
                  </Link>

                  {user.rol === 'admin' && (
                    <Link href="/panel/usuarios" className="text-gray-600 hover:text-primary flex items-center gap-1">
                      <Users className="h-4 w-4" /> Usuarios
                    </Link>
                  )}

                  {user.rol === 'prestador' && (
                    <Link href="/panel/mis-servicios" className="text-gray-600 hover:text-primary flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> Mis Servicios
                    </Link>
                  )}

                  {user.rol === 'contratante' && (
                    <Link href="/panel/servicios" className="text-gray-600 hover:text-primary flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> Buscar Servicios
                    </Link>
                  )}
                </nav>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-medium">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.rol}</p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Salir</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}
