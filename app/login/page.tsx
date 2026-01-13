'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, initializeData } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Inicializa datos primero
    initializeData();
    
    // Intenta hacer login
    const success = login(email, password);
    
    if (success) {
      // Redirige al panel
      router.push('/panel');
      // Fuerza recarga para actualizar el layout
      router.refresh();
    } else {
      setError('Credenciales incorrectas. Usa: admin@pampapro.com, prestador@pampapro.com o contratante@pampapro.com - contraseña: 123456');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-primary">PampaPro</span>
          </Link>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
          
          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Email:</strong> admin@pampapro.com</p>
              <p><strong>Email:</strong> prestador@pampapro.com</p>
              <p><strong>Email:</strong> contratante@pampapro.com</p>
              <p><strong>Contraseña para todos:</strong> 123456</p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}