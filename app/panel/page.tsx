'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input'; 
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical, 
  MapPin, 
  Star, 
  CheckCircle, 
  Image as ImageIcon, 
  Calendar,
  Clock,
  DollarSign,
  Filter,
  ThumbsUp,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Home,
  Sparkles
} from 'lucide-react';
import { 
  defaultUsers, 
  defaultServices, 
  type User, 
  type Service, 
  type TrabajoRealizado,
  type Solicitud 
} from '../../lib/auth';

type FeedItemType = 'publicacion' | 'servicio' | 'trabajo' | 'solicitud' | 'promocion' | 'testimonio';
type UserRole = 'admin' | 'prestador' | 'contratante';

interface FeedItem {
  id: string;
  type: FeedItemType;
  user: User;
  content: string;
  fecha: string;
  servicio?: Service;
  trabajo?: TrabajoRealizado;
  solicitud?: Solicitud;
  likes: number;
  comentarios: { id: string; user: User; content: string; fecha: string; }[];
  compartidos: number;
  liked: boolean;
  imagenes?: string[];
  ubicacion?: string;
}

// Simulamos un usuario logueado (en un caso real esto vendría de auth)
const currentUser: User = defaultUsers[1]; // María González como prestadora por defecto

export default function PanelPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: '1',
      type: 'testimonio',
      user: defaultUsers[2], // Juan Pérez (contratante)
      content: '¡Excelente servicio de jardinería! María hizo un trabajo impecable en mi patio. Superó todas mis expectativas. Totalmente recomendado 🌟',
      fecha: 'Hace 2 horas',
      likes: 24,
      comentarios: [
        { id: 'c1', user: defaultUsers[1], content: '¡Gracias Juan! Fue un placer trabajar en tu jardín', fecha: 'Hace 1 hora' }
      ],
      compartidos: 3,
      liked: false,
    },
    {
      id: '2',
      type: 'servicio',
      user: defaultUsers[1], // María González (prestadora)
      servicio: defaultServices[0],
      content: '¡Lanzamiento especial! Por tiempo limitado, 20% de descuento en limpieza del hogar para nuevos clientes. ¡Reserva tu turno! 🏡✨',
      fecha: 'Ayer',
      likes: 42,
      comentarios: [
        { id: 'c1', user: defaultUsers[2], content: '¿Este descuento aplica para departamentos?', fecha: 'Hace 10 horas' },
        { id: 'c2', user: defaultUsers[1], content: '¡Sí Juan! Aplica para casas y departamentos hasta 3 ambientes', fecha: 'Hace 9 horas' }
      ],
      compartidos: 7,
      liked: true,
      imagenes: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800'],
    },
    {
      id: '3',
      type: 'trabajo',
      user: defaultUsers[1], // María González
      trabajo: {
        id: '1',
        servicioId: '4',
        prestadorId: '2',
        imagenUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800',
        descripcion: 'Transformación completa de jardín con diseño sostenible y riego automático',
        fecha: '2024-01-15',
      },
      content: 'Comparto el antes y después de este proyecto de paisajismo. El cliente quería un espacio verde minimalista y fácil de mantener. ¿Qué opinan? 🌱🌺',
      fecha: 'Hace 3 días',
      likes: 89,
      comentarios: [
        { id: 'c1', user: defaultUsers[0], content: '¡Increíble transformación! El contraste es espectacular', fecha: 'Hace 2 días' },
        { id: 'c2', user: defaultUsers[2], content: 'Me encanta el diseño moderno, ¿hacés trabajos similares en zona norte?', fecha: 'Hace 1 día' }
      ],
      compartidos: 12,
      liked: false,
      imagenes: [
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800'
      ],
    },
    {
      id: '4',
      type: 'promocion',
      user: defaultUsers[0], // Admin
      content: '🎉 ¡Nueva función en PampaPro! Ahora podés calificar los servicios después de completados. Ayudanos a mantener la calidad de la comunidad. ⭐⭐⭐⭐⭐',
      fecha: 'Hace 4 días',
      likes: 156,
      comentarios: [
        { id: 'c1', user: defaultUsers[2], content: 'Excelente mejora, es muy importante poder dar feedback', fecha: 'Hace 3 días' }
      ],
      compartidos: 45,
      liked: true,
    },
    {
      id: '5',
      type: 'solicitud',
      user: defaultUsers[2], // Juan Pérez
      solicitud: {
        id: '1',
        servicioId: '5',
        servicioNombre: 'Carpintería a Medida',
        contratanteId: '3',
        contratanteNombre: 'Juan Pérez',
        prestadorId: '2',
        prestadorNombre: 'María González',
        estado: 'completada',
        fecha: '2024-01-10',
        mensaje: 'Necesitaba un mueble para el living con medidas específicas y almacenamiento inteligente',
      },
      content: 'Mi experiencia con el servicio de carpintería fue excelente. El mueble quedó perfecto y la comunicación durante todo el proceso fue impecable. ¡Gracias PampaPro! 🪚✨',
      fecha: 'Hace 1 semana',
      likes: 31,
      comentarios: [],
      compartidos: 1,
      liked: true,
    },
  ]);

  const [nuevoPost, setNuevoPost] = useState('');
  const [tipoPublicacion, setTipoPublicacion] = useState<FeedItemType>('publicacion');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [filtroActivo, setFiltroActivo] = useState<string>('todos');
  const [mostrarCrearPost, setMostrarCrearPost] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState<Record<string, string>>({});

  // Filtrar items según el tipo
  const itemsFiltrados = filtroActivo === 'todos' 
    ? feedItems 
    : feedItems.filter(item => item.type === filtroActivo);

  const crearPublicacion = () => {
    if (!nuevoPost.trim()) return;

    const nuevoItem: FeedItem = {
      id: Date.now().toString(),
      type: tipoPublicacion,
      user: currentUser,
      content: nuevoPost,
      fecha: 'Justo ahora',
      servicio: tipoPublicacion === 'servicio' && servicioSeleccionado
        ? defaultServices.find(s => s.id === servicioSeleccionado) 
        : undefined,
      trabajo: tipoPublicacion === 'trabajo' ? {
        id: Date.now().toString(),
        servicioId: '4',
        prestadorId: currentUser.id,
        imagenUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800',
        descripcion: 'Nuevo trabajo completado',
        fecha: new Date().toISOString(),
      } : undefined,
      likes: 0,
      comentarios: [],
      compartidos: 0,
      liked: false,
    };

    setFeedItems([nuevoItem, ...feedItems]);
    setNuevoPost('');
    setServicioSeleccionado('');
    setMostrarCrearPost(false);
  };

  const toggleLike = (id: string) => {
    setFeedItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  const agregarComentario = (itemId: string) => {
    if (!nuevoComentario[itemId]?.trim()) return;

    const comentario = {
      id: Date.now().toString(),
      user: currentUser,
      content: nuevoComentario[itemId],
      fecha: 'Justo ahora',
    };

    setFeedItems(items =>
      items.map(item =>
        item.id === itemId
          ? {
              ...item,
              comentarios: [comentario, ...item.comentarios],
            }
          : item
      )
    );

    setNuevoComentario(prev => ({ ...prev, [itemId]: '' }));
  };

  const renderTipoBadge = (type: FeedItemType) => {
    const config = {
      publicacion: { label: 'Publicación', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      servicio: { label: 'Servicio', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      trabajo: { label: 'Trabajo Realizado', color: 'bg-violet-100 text-violet-800 border-violet-200' },
      solicitud: { label: 'Solicitud', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      promocion: { label: 'Anuncio', color: 'bg-rose-100 text-rose-800 border-rose-200' },
      testimonio: { label: 'Testimonio', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    };
    
    return (
      <Badge variant="outline" className={`${config[type].color} ml-2 border-2 font-medium`}>
        {config[type].label}
      </Badge>
    );
  };

  const renderServicioInfo = (servicio: Service) => (
    <div className="mt-3 bg-gradient-to-r from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
      <div className="flex items-start gap-4">
        {servicio.imagenes[0] && (
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <img
              src={servicio.imagenes[0]}
              alt={servicio.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-lg text-gray-800">{servicio.nombre}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{servicio.descripcion}</p>
            </div>
            <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
              <span className="font-bold text-lg text-emerald-600">${servicio.precio.toLocaleString()}</span>
              <span className="text-xs text-gray-500 ml-1">/{servicio.precioTipo}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold">{servicio.calificacion}</span>
              <span className="text-sm text-gray-500">({servicio.reseñas})</span>
            </div>
            
            {servicio.ubicacion && (
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-gray-600">{servicio.ubicacion}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
              <Briefcase className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-gray-600 capitalize">{servicio.categoria}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Disponibilidad:</span>
              <div className="flex gap-1">
                {Object.entries(servicio.disponibilidad).map(([dia, horarios]) => 
                  horarios.length > 0 && (
                    <span key={dia} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {dia.slice(0, 3)}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrabajoInfo = (trabajo: TrabajoRealizado) => (
    <div className="mt-3 space-y-3">
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src={trabajo.imagenUrl}
          alt="Trabajo realizado"
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Proyecto Completado</span>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-violet-50 to-white p-4 rounded-xl border border-violet-100">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-violet-600" />
          <div>
            <span className="font-semibold text-violet-700">Trabajo finalizado con éxito</span>
            <p className="text-sm text-gray-600 mt-1">{trabajo.descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSolicitudInfo = (solicitud: Solicitud) => (
    <div className="mt-3 bg-gradient-to-r from-amber-50 to-white rounded-xl p-5 border border-amber-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              solicitud.estado === 'completada' ? 'bg-emerald-100 text-emerald-700' :
              solicitud.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              <span className="font-semibold capitalize">{solicitud.estado}</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-full border">
              <span className="font-medium">{solicitud.servicioNombre}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border">
              <p className="text-gray-700 italic">"{solicitud.mensaje}"</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Contratante</span>
                  <p className="font-medium">{solicitud.contratanteNombre}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Prestador</span>
                  <p className="font-medium">{solicitud.prestadorNombre}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserRoleBadge = (rol: UserRole) => {
    const config = {
      admin: { label: 'Administrador', color: 'bg-rose-100 text-rose-800 border-rose-200' },
      prestador: { label: 'Prestador', color: 'bg-violet-100 text-violet-800 border-violet-200' },
      contratante: { label: 'Cliente', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    };
    
    return (
      <Badge variant="outline" className={`${config[rol].color} text-xs border`}>
        {config[rol].label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header del feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Comunidad PampaPro
              </h1>
              <p className="text-gray-600 mt-2">
                Conecta con profesionales y descubre servicios increíbles
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Rol actual:</span>
              {renderUserRoleBadge(currentUser.rol as UserRole)}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filtroActivo === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroActivo('todos')}
              className={`whitespace-nowrap ${filtroActivo === 'todos' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : ''}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Todos
            </Button>
            {(['servicio', 'trabajo', 'testimonio', 'promocion', 'solicitud'] as FeedItemType[]).map((type) => (
              <Button
                key={type}
                variant={filtroActivo === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroActivo(type)}
                className={`whitespace-nowrap ${filtroActivo === type ? 
                  type === 'servicio' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                  type === 'trabajo' ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                  type === 'testimonio' ? 'bg-gradient-to-r from-sky-500 to-blue-500' :
                  'bg-gradient-to-r from-amber-500 to-orange-500'
                : ''}`}
              >
                {type === 'servicio' && <Briefcase className="w-4 h-4 mr-2" />}
                {type === 'trabajo' && <Award className="w-4 h-4 mr-2" />}
                {type === 'testimonio' && <ThumbsUp className="w-4 h-4 mr-2" />}
                {type === 'promocion' && <TrendingUp className="w-4 h-4 mr-2" />}
                {type === 'solicitud' && <Home className="w-4 h-4 mr-2" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Crear publicación y estadísticas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tarjeta de crear publicación */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-white shadow">
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      {currentUser.nombre.charAt(0)}{currentUser.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-800">{currentUser.nombre} {currentUser.apellido}</h3>
                    <p className="text-sm text-gray-500">¿Qué quieres compartir hoy?</p>
                  </div>
                </div>
                
                <Dialog open={mostrarCrearPost} onOpenChange={setMostrarCrearPost}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl h-12"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Crear publicación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                        Crear nueva publicación
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                            {currentUser.nombre.charAt(0)}{currentUser.apellido.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{currentUser.nombre} {currentUser.apellido}</p>
                          <div className="flex gap-2 mt-1">
                            {(['publicacion', 'servicio', 'trabajo'] as FeedItemType[]).map((type) => (
                              <Button
                                key={type}
                                type="button"
                                variant={tipoPublicacion === type ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTipoPublicacion(type)}
                                className={`rounded-full ${tipoPublicacion === type ? 
                                  type === 'servicio' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                  type === 'trabajo' ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                                  'bg-gradient-to-r from-indigo-500 to-purple-500'
                                : ''}`}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder={`${tipoPublicacion === 'servicio' ? 'Describe tu servicio...' : tipoPublicacion === 'trabajo' ? 'Comparte los detalles de tu trabajo...' : '¿Qué quieres compartir con la comunidad?'}`}
                        value={nuevoPost}
                        onChange={(e) => setNuevoPost(e.target.value)}
                        className="min-h-[150px] resize-none border-gray-200 focus:border-indigo-300 rounded-xl"
                      />
                      
                      {tipoPublicacion === 'servicio' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Seleccionar servicio
                          </label>
                          <select title="servicio"
                            value={servicioSeleccionado}
                            onChange={(e) => setServicioSeleccionado(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                          >
                            <option value="">Elige un servicio</option>
                            {defaultServices.map(service => (
                              <option key={service.id} value={service.id}>
                                {service.nombre} - ${service.precio} ({service.categoria})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Imagen
                          </Button>
                        </div>
                        <Button 
                          onClick={crearPublicacion}
                          disabled={!nuevoPost.trim() || (tipoPublicacion === 'servicio' && !servicioSeleccionado)}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full px-6"
                        >
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Estadísticas de la comunidad */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Comunidad Activa
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                    <span className="text-sm opacity-90">Servicios activos</span>
                    <span className="font-bold text-lg">{defaultServices.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                    <span className="text-sm opacity-90">Miembros</span>
                    <span className="font-bold text-lg">{defaultUsers.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                    <span className="text-sm opacity-90">Interacciones hoy</span>
                    <span className="font-bold text-lg">1.2k</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna central - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {itemsFiltrados.map((item) => (
              <Card key={item.id} className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12 border-2 border-white shadow">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.id}`} />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          {item.user.nombre.charAt(0)}{item.user.apellido.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800">
                            {item.user.nombre} {item.user.apellido}
                          </h3>
                          {renderUserRoleBadge(item.user.rol as UserRole)}
                          {renderTipoBadge(item.type)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.fecha}</span>
                          {item.ubicacion && (
                            <>
                              <span>•</span>
                              <MapPin className="w-3 h-3" />
                              <span>{item.ubicacion}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <p className="text-gray-700 text-lg mb-4">{item.content}</p>
                  
                  {/* Contenido específico según el tipo */}
                  {item.type === 'servicio' && item.servicio && renderServicioInfo(item.servicio)}
                  {item.type === 'trabajo' && item.trabajo && renderTrabajoInfo(item.trabajo)}
                  {item.type === 'solicitud' && item.solicitud && renderSolicitudInfo(item.solicitud)}
                  
                  {/* Imágenes adicionales */}
                  {item.imagenes && item.imagenes.length > 0 && item.type !== 'trabajo' && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {item.imagenes.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Imagen ${idx + 1}`}
                          className="rounded-xl object-cover w-full h-48"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Estadísticas */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border border-white"></div>
                          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full border border-white"></div>
                          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border border-white"></div>
                        </div>
                        <span className="ml-2 font-medium">{item.likes} reacciones</span>
                      </div>
                      <span>{item.comentarios.length} comentarios</span>
                      <span>{item.compartidos} compartidos</span>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex w-full gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      className={`flex-1 rounded-xl ${item.liked ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'hover:bg-gray-100'}`}
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${item.liked ? 'fill-rose-600' : ''}`} />
                      <span className={item.liked ? 'font-semibold' : ''}>Me gusta</span>
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-xl hover:bg-gray-100">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Comentar
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-xl hover:bg-gray-100">
                      <Share2 className="w-5 h-5 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
                
                {/* Sección de comentarios */}
                <CardFooter className="pt-0">
                  <div className="w-full space-y-4">
                    {/* Comentarios existentes */}
                    {item.comentarios.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {item.comentarios.map((comentario) => (
                          <div key={comentario.id} className="flex gap-3">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {comentario.user.nombre.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-100 rounded-2xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {comentario.user.nombre} {comentario.user.apellido}
                                  </span>
                                  <span className="text-xs text-gray-500">{comentario.fecha}</span>
                                </div>
                                <p className="text-sm text-gray-700 break-words">{comentario.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Formulario para nuevo comentario */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {currentUser.nombre.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Escribe un comentario..."
                          value={nuevoComentario[item.id] || ''}
                          onChange={(e) => setNuevoComentario(prev => ({ 
                            ...prev, 
                            [item.id]: e.target.value 
                          }))}
                          className="flex-1 border-gray-200 rounded-full"
                          onKeyPress={(e) => e.key === 'Enter' && agregarComentario(item.id)}
                        />
                        <Button 
                          size="sm"
                          onClick={() => agregarComentario(item.id)}
                          className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          disabled={!nuevoComentario[item.id]?.trim()}
                        >
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}