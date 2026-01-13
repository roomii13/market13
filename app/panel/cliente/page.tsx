'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  TrendingUp,
  Calendar,
  Briefcase,
  Users,
  Sparkles
} from 'lucide-react';

// Datos de ejemplo para cliente
const serviciosRecomendados = [
  { id: 1, nombre: 'Limpieza Profunda', categoria: 'Limpieza', precio: 18000, calificacion: 4.9 },
  { id: 2, nombre: 'Electricista Urgente', categoria: 'Electricidad', precio: 22000, calificacion: 4.8 },
  { id: 3, nombre: 'Jardinería Express', categoria: 'Jardinería', precio: 15000, calificacion: 4.7 },
];

export default function ClientePanelPage() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Encuentra el Servicio Perfecto
            </h1>
            <p className="text-gray-600 mt-2">
              Descubre profesionales calificados cerca de ti
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="¿Qué servicio necesitas hoy? (plomería, limpieza, jardinería...)"
              value={busqueda}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-200 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Filtros de categoría */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Button
              variant={categoriaFiltro === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoriaFiltro('todos')}
              className="whitespace-nowrap rounded-full"
            >
              Todos
            </Button>
            {['Limpieza', 'Jardinería', 'Plomería', 'Electricidad', 'Carpintería', 'Transporte'].map((cat) => (
              <Button
                key={cat}
                variant={categoriaFiltro === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoriaFiltro(cat)}
                className="whitespace-nowrap rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Servicios */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Servicios Recomendados</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Ordenar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {serviciosRecomendados.map((servicio) => (
                <Card key={servicio.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{servicio.nombre}</h3>
                        <Badge variant="outline" className="mt-2">{servicio.categoria}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-emerald-600">${servicio.precio.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm">{servicio.calificacion}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Disponible hoy</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Zona Centro</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6">Ver Detalles</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Testimonios */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">Testimonios Recientes</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>JP</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Juan Pérez</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">"Excelente servicio de jardinería, muy profesional y puntual."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Info Cliente */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Mis Solicitudes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Limpieza</p>
                      <p className="text-sm text-gray-600">En proceso</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Hoy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Plomería</p>
                      <p className="text-sm text-gray-600">Completado</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">Ayer</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-900 to-cyan-800 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Consejos Rápidos
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                    <span>Revisa las calificaciones y reseñas antes de contratar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                    <span>Describe claramente lo que necesitas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-white rounded-full mt-1.5"></div>
                    <span>Programa con anticipación para mejores precios</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Profesionales Destacados</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-violet-100 text-violet-800">MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">María González</h4>
                      <p className="text-sm text-gray-600">Especialista en múltiples servicios</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs">4.9 (42 reseñas)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}