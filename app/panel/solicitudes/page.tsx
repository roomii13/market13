'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getSolicitudes, updateSolicitud, User, Solicitud } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, CheckCircle } from 'lucide-react';

export default function SolicitudesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadSolicitudes(currentUser);
  }, [router]);

  const loadSolicitudes = (currentUser: User) => {
    const todas = getSolicitudes();
    if (currentUser.rol === 'prestador') {
      setSolicitudes(todas.filter(s => s.prestadorId === currentUser.id));
    } else if (currentUser.rol === 'contratante') {
      setSolicitudes(todas.filter(s => s.contratanteId === currentUser.id));
    } else {
      setSolicitudes(todas);
    }
  };

  const handleUpdateEstado = (id: string, estado: Solicitud['estado']) => {
    updateSolicitud(id, { estado });
    if (user) loadSolicitudes(user);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Badge variant="outline" className="bg-yellow-50"><Clock className="h-3 w-3 mr-1" /> Pendiente</Badge>;
      case 'aceptada': return <Badge variant="secondary" className="bg-green-50 text-green-700"><Check className="h-3 w-3 mr-1" /> Aceptada</Badge>;
      case 'rechazada': return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Rechazada</Badge>;
      case 'completada': return <Badge className="bg-blue-500"><CheckCircle className="h-3 w-3 mr-1" /> Completada</Badge>;
      default: return <Badge>{estado}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {user.rol === 'prestador' ? 'Solicitudes Recibidas' : 'Mis Solicitudes'}
        </h1>
        <p className="text-muted-foreground">
          {user.rol === 'prestador' ? 'Gestiona las solicitudes de tus clientes' : 'Revisa el estado de tus solicitudes'}
        </p>
      </div>

      {solicitudes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay solicitudes por el momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud) => (
            <Card key={solicitud.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{solicitud.servicioNombre}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.rol === 'prestador' 
                        ? `Solicitado por: ${solicitud.contratanteNombre}`
                        : `Prestador: ${solicitud.prestadorNombre}`
                      }
                    </p>
                  </div>
                  {getEstadoBadge(solicitud.estado)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solicitud.mensaje && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Mensaje:</p>
                      <p className="text-sm text-muted-foreground">{solicitud.mensaje}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Fecha: {new Date(solicitud.fecha).toLocaleDateString('es-AR', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  {user.rol === 'prestador' && solicitud.estado === 'pendiente' && (
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateEstado(solicitud.id, 'aceptada')} className="flex-1">
                        <Check className="h-4 w-4 mr-2" /> Aceptar
                      </Button>
                      <Button variant="outline" onClick={() => handleUpdateEstado(solicitud.id, 'rechazada')} className="flex-1">
                        <X className="h-4 w-4 mr-2" /> Rechazar
                      </Button>
                    </div>
                  )}
                  {user.rol === 'prestador' && solicitud.estado === 'aceptada' && (
                    <Button onClick={() => handleUpdateEstado(solicitud.id, 'completada')} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" /> Marcar como completada
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
