'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUsers, deleteUser, User } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Phone } from 'lucide-react';

export default function UsuariosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
      router.push('/panel');
      return;
    }
    setUser(currentUser);
    setUsuarios(getUsers());
  }, [router]);

  const handleDelete = (id: string) => {
    if (confirm('Estas seguro de eliminar este usuario?')) {
      deleteUser(id);
      setUsuarios(getUsers());
    }
  };

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case 'admin': return <Badge variant="destructive">Administrador</Badge>;
      case 'prestador': return <Badge variant="secondary">Prestador</Badge>;
      case 'contratante': return <Badge>Contratante</Badge>;
      default: return <Badge variant="outline">{rol}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestion de Usuarios</h1>
        <p className="text-muted-foreground">Administra todos los usuarios de la plataforma</p>
      </div>

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <span className="text-lg font-bold text-primary">
                    {usuario.nombre[0]}{usuario.apellido[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{usuario.nombre} {usuario.apellido}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {usuario.email}
                    </span>
                    {usuario.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {usuario.telefono}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getRolBadge(usuario.rol)}
                {usuario.id !== user.id && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
