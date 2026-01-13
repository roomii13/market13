'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Activity, 
  AlertCircle, 
  BarChart3, 
  TrendingUp,
  Eye,
  Filter,
  Search,
  Shield,
  Settings,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Datos de ejemplo para admin
const adminStats = {
  usuariosTotales: 245,
  usuariosNuevos: 12,
  prestadoresActivos: 89,
  clientesActivos: 156,
  serviciosPublicados: 142,
  serviciosPendientes: 8,
  solicitudesHoy: 23,
  solicitudesCompletadas: 456,
  ingresosMensuales: 1250000,
  crecimiento: '+18%',
};

const actividadesRecientes = [
  { id: 1, usuario: 'María González', accion: 'Publicó nuevo servicio', tipo: 'servicio', fecha: 'Hace 10 min' },
  { id: 2, usuario: 'Juan Pérez', accion: 'Completó una solicitud', tipo: 'solicitud', fecha: 'Hace 25 min' },
  { id: 3, usuario: 'Carlos López', accion: 'Se registró como prestador', tipo: 'registro', fecha: 'Hace 1 hora' },
  { id: 4, usuario: 'Ana Martínez', accion: 'Reportó un problema', tipo: 'reporte', fecha: 'Hace 2 horas' },
  { id: 5, usuario: 'Pedro Gómez', accion: 'Actualizó su perfil', tipo: 'perfil', fecha: 'Hace 3 horas' },
];

export default function AdminPanelPage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const generarReporte = () => {
    toast.success('Reporte generado exitosamente');
    // lógica para generar y descargar el reporte
  };

  const actualizarDatos = () => {
    toast.info('Actualizando datos...');
    // lógica para actualizar datos desde el backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y monitoriza toda la actividad de PampaPro
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={actualizarDatos}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button size="sm" onClick={generarReporte}>
                <Download className="w-4 h-4 mr-2" />
                Reporte Mensual
              </Button>
            </div>
          </div>

          {/* Barra de herramientas */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar usuarios, servicios, actividades..."
                value={busqueda}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Usuarios Totales */}
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Usuarios Totales</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats.usuariosTotales}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600">+{adminStats.usuariosNuevos} nuevos</span>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Servicios Activos */}
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Servicios Activos</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats.serviciosPublicados}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                      {adminStats.serviciosPendientes} pendientes
                    </Badge>
                  </div>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solicitudes */}
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Solicitudes Hoy</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{adminStats.solicitudesHoy}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {adminStats.solicitudesCompletadas.toLocaleString()} total completadas
                  </p>
                </div>
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingresos */}
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Ingresos Mensuales</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ${(adminStats.ingresosMensuales / 1000).toFixed(0)}K
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600">{adminStats.crecimiento}</span>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Actividad Reciente */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
                  <div className="flex gap-2">
                    <select 
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      className="text-sm border rounded-lg px-3 py-1"
                    >
                      <option value="todos">Todos</option>
                      <option value="servicio">Servicios</option>
                      <option value="solicitud">Solicitudes</option>
                      <option value="registro">Registros</option>
                      <option value="reporte">Reportes</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actividadesRecientes
                    .filter(act => filtro === 'todos' || act.tipo === filtro)
                    .map((actividad) => (
                      <div key={actividad.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {actividad.usuario.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{actividad.usuario}</p>
                            <p className="text-sm text-gray-600">{actividad.accion}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={
                            actividad.tipo === 'servicio' ? 'bg-emerald-50 text-emerald-700' :
                            actividad.tipo === 'solicitud' ? 'bg-amber-50 text-amber-700' :
                            actividad.tipo === 'registro' ? 'bg-blue-50 text-blue-700' :
                            'bg-rose-50 text-rose-700'
                          }>
                            {actividad.tipo}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{actividad.fecha}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Acciones Rápidas */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-800">Acciones Rápidas</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Gestionar Permisos
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Ver Reportes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentación
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Moderar Contenido
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Estado del Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Servidores</span>
                    <Badge className="bg-green-500/20 text-green-400">Operacional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Base de Datos</span>
                    <Badge className="bg-green-500/20 text-green-400">Estable</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">API</span>
                    <Badge className="bg-green-500/20 text-green-400">100%</Badge>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-sm opacity-90">Última actualización: Hace 5 min</p>
                    <p className="text-xs opacity-70 mt-1">Monitoreo 24/7 activo</p>
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