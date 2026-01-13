'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Star, 
  MessageCircle, 
  Heart, 
  Share2, 
  Image as ImageIcon,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Award,
  Sparkles,
  PlusCircle,
  Filter,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

// Datos de ejemplo para prestador
const prestadorStats = {
  serviciosActivos: 5,
  clientesAtendidos: 42,
  calificacionPromedio: 4.8,
  ingresosMes: 85000,
  solicitudesPendientes: 3,
  proximasCitas: 2,
};

const misServicios = [
  { id: 1, nombre: 'Limpieza del Hogar', precio: 15000, citas: 12, estado: 'activo' },
  { id: 2, nombre: 'Jardinería', precio: 18000, citas: 8, estado: 'activo' },
  { id: 3, nombre: 'Plomería', precio: 25000, citas: 5, estado: 'pausado' },
];

export default function PrestadorPanelPage() {
  const [nuevoPost, setNuevoPost] = useState('');
  const [mostrarCrearPost, setMostrarCrearPost] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Mi Panel de Servicios
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus servicios y conecta con nuevos clientes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>
          </div>

          {/* Barra de herramientas */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar en mis servicios, clientes..."
                value={busqueda}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-violet-600 font-medium">Servicios Activos</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{prestadorStats.serviciosActivos}</p>
                  <p className="text-xs text-gray-500 mt-1">Gestionando actualmente</p>
                </div>
                <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Calificación</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{prestadorStats.calificacionPromedio}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">({prestadorStats.clientesAtendidos} reseñas)</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Star className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Ingresos Este Mes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">${prestadorStats.ingresosMes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{prestadorStats.solicitudesPendientes} solicitudes pendientes</p>
                </div>
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Mis Servicios */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Mis Servicios</h2>
                  <Button size="sm" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {misServicios.map((servicio) => (
                    <div key={servicio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{servicio.nombre}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">${servicio.precio.toLocaleString()}</span>
                            <span className="text-sm text-gray-600">{servicio.citas} citas</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Badge className={
                          servicio.estado === 'activo' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }>
                          {servicio.estado}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sección de Feed (más simple que la versión completa) */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-violet-100 text-violet-800">PG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Comparte una actualización sobre tus servicios..."
                      className="min-h-[100px] border-gray-300"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Foto
                  </Button>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Publicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Próximas Citas */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">Próximas Citas</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Limpieza Residencial</h3>
                      <Badge className="bg-blue-100 text-blue-800">Mañana</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>10:00 AM - 12:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Av. Siempre Viva 123</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-900 to-purple-800 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Tips para Prestadores
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                    <span>Responde rápido a las solicitudes para aumentar tu calificación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                    <span>Sube fotos de tus trabajos anteriores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt=1.5"></div>
                    <span>Mantén tu disponibilidad actualizada</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}