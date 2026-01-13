'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getServices, addService, updateService, deleteService, User, Service } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

export default function MisServiciosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '' });
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'prestador') {
      router.push('/panel');
      return;
    }
    setUser(currentUser);
    loadServices(currentUser.id);
  }, [router]);

  const loadServices = (userId: string) => {
    setServicios(getServices().filter(s => s.prestadorId === userId));
  };

  const handleSubmit = () => {
    if (!user) return;

    if (editingService) {
      updateService(editingService.id, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        categoria: form.categoria,
      });
    } else {
      addService({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        categoria: form.categoria,
        prestadorId: user.id,
        prestadorNombre: `${user.nombre} ${user.apellido}`,
        disponible: true,
      });
    }

    setForm({ nombre: '', descripcion: '', precio: '', categoria: '' });
    setEditingService(null);
    setIsOpen(false);
    loadServices(user.id);
  };

  const handleEdit = (servicio: Service) => {
    setEditingService(servicio);
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      categoria: servicio.categoria,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    if (confirm('Estas seguro de eliminar este servicio?')) {
      deleteService(id);
      loadServices(user.id);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios que ofreces</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingService(null); setForm({ nombre: '', descripcion: '', precio: '', categoria: '' }); }}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Editar servicio' : 'Nuevo servicio'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nombre del servicio</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Limpieza del hogar" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Ej: Limpieza, Plomeria, Electricidad" />
              </div>
              <div className="space-y-2">
                <Label>Precio (ARS)</Label>
                <Input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label>Descripcion</Label>
                <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Describe tu servicio..." rows={3} />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {editingService ? 'Guardar cambios' : 'Crear servicio'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {servicios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Aun no tienes servicios publicados</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Publicar mi primer servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <Card key={servicio.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{servicio.categoria}</Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(servicio)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(servicio.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="mt-2">{servicio.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{servicio.descripcion}</p>
                <div className="flex items-center gap-2 text-lg font-bold text-primary">
                  <DollarSign className="h-5 w-5" />
                  ${servicio.precio.toLocaleString('es-AR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
