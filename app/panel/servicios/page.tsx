// /app/panel/servicios/page.tsx - Versión mejorada
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getServices, addSolicitud, User, Service } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, DollarSign, User as UserIcon, MapPin, Clock, Star, Filter, 
  Camera, MessageCircle, Calendar, Shield, CheckCircle 
} from 'lucide-react';
import Image from 'next/image';
import  { uploadFile }  from '../../../lib/upload';
import ChatModal from '../../../components/chat/chatModal';

export default function ServiciosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<Service[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ubicacionFiltro, setUbicacionFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatWithPrestador, setChatWithPrestador] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    const serviciosData = getServices().filter(s => s.disponible);
    setServicios(serviciosData);
    setFilteredServicios(serviciosData);
  }, [router]);

  useEffect(() => {
    let resultados = servicios;
    
    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultados = resultados.filter(s => 
        s.nombre.toLowerCase().includes(busquedaLower) ||
        s.categoria.toLowerCase().includes(busquedaLower) ||
        s.descripcion.toLowerCase().includes(busquedaLower) ||
        s.prestadorNombre.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Filtro por categoría
    if (categoriaFiltro !== 'todos') {
      resultados = resultados.filter(s => s.categoria === categoriaFiltro);
    }
    
    // Filtro por precio
    if (precioMin) {
      resultados = resultados.filter(s => s.precio >= Number(precioMin));
    }
    if (precioMax) {
      resultados = resultados.filter(s => s.precio <= Number(precioMax));
    }
    
    // Filtro por ubicación
    if (ubicacionFiltro) {
      resultados = resultados.filter(s => 
        s.ubicacion?.toLowerCase().includes(ubicacionFiltro.toLowerCase())
      );
    }
    
    setFilteredServicios(resultados);
  }, [busqueda, categoriaFiltro, precioMin, precioMax, ubicacionFiltro, servicios]);

  const categoriasUnicas = ['todos', ...new Set(servicios.map(s => s.categoria))];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagenPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Aquí subirías la imagen a tu servidor
    // const imageUrl = await uploadImage(file);
  };

  const handleSolicitar = () => {
    if (!user || !selectedService) return;

    addSolicitud({
      servicioId: selectedService.id,
      servicioNombre: selectedService.nombre,
      contratanteId: user.id,
      contratanteNombre: `${user.nombre} ${user.apellido}`,
      prestadorId: selectedService.prestadorId,
      prestadorNombre: selectedService.prestadorNombre,
      estado: 'pendiente',
      mensaje,
      imagenes: imagenPreview ? [imagenPreview] : [],
    });

    alert('Solicitud enviada correctamente!');
    setSelectedService(null);
    setMensaje('');
    setImagenPreview(null);
  };

  const iniciarChat = (prestadorId: string, prestadorNombre: string) => {
    // Aquí buscarías el usuario prestador
    setChatWithPrestador({
      id: prestadorId,
      nombre: prestadorNombre.split(' ')[0],
      apellido: prestadorNombre.split(' ')[1] || '',
      email: '',
      rol: 'prestador',
      createdAt: new Date().toISOString(),
    });
    setIsChatOpen(true);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Servicios Disponibles</h1>
        <p className="text-muted-foreground">
          Encuentra el servicio perfecto para tus necesidades
          {user.ubicacion && ` en ${user.ubicacion}`}
        </p>
      </div>

      {/* Filtros avanzados */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar servicios..."
                className="pl-10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <select
                className="w-full p-2 border rounded-md"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                {categoriasUnicas.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'todos' ? 'Todas las categorías' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por precio */}
            <div className="flex gap-2">
              <Input
                placeholder="Precio min"
                type="number"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
              />
              <Input
                placeholder="Precio max"
                type="number"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
              />
            </div>

            {/* Filtro por ubicación */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Ubicación"
                className="pl-10"
                value={ubicacionFiltro}
                onChange={(e) => setUbicacionFiltro(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de servicios */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => (
          <Card key={servicio.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              {/* Galería de imágenes */}
              {servicio.imagenes && servicio.imagenes.length > 0 ? (
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={servicio.imagenes[0]}
                    alt={servicio.nombre}
                    fill
                    className="object-cover"
                  />
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    {servicio.categoria}
                  </Badge>
                  {servicio.calificacion > 0 && (
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      <Star className="h-3 w-3 mr-1" /> {servicio.calificacion.toFixed(1)}
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <CardTitle className="mt-2">{servicio.nombre}</CardTitle>
              <CardDescription className="line-clamp-2">{servicio.descripcion}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="space-y-3">
                {/* Información del prestador */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{servicio.prestadorNombre}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => iniciarChat(servicio.prestadorId, servicio.prestadorNombre)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>

                {/* Ubicación */}
                {servicio.ubicacion && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {servicio.ubicacion}
                  </div>
                )}

                {/* Precio y disponibilidad */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    ${servicio.precio.toLocaleString('es-AR')}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{servicio.precioTipo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Disponible</span>
                  </div>
                </div>

                {/* Reseñas */}
                {servicio.reseñas > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {servicio.reseñas} reseña{servicio.reseñas !== 1 ? 's' : ''}
                  </div>
                )}

                {/* Botón de solicitar */}
                {user.rol === 'contratante' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-2"
                        onClick={() => setSelectedService(servicio)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Solicitar servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Solicitar: {servicio.nombre}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {/* Información del servicio */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Prestador:</p>
                            <p className="text-sm text-muted-foreground">{servicio.prestadorNombre}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Precio:</p>
                            <p className="text-lg font-bold text-primary">
                              ${servicio.precio.toLocaleString('es-AR')} /{servicio.precioTipo}
                            </p>
                          </div>
                        </div>

                        {/* Subida de imagen (opcional) */}
                        <div>
                          <p className="text-sm font-medium mb-2">Adjuntar imagen (opcional)</p>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {imagenPreview ? (
                              <div className="relative">
                                <img 
                                  src={imagenPreview} 
                                  alt="Preview" 
                                  className="max-h-48 mx-auto rounded-lg"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => setImagenPreview(null)}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  Sube una foto de referencia si es necesario
                                </p>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className="hidden"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  Seleccionar imagen
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Mensaje personalizado */}
                        <div>
                          <p className="text-sm font-medium mb-2">Mensaje para el prestador:</p>
                          <Textarea
                            placeholder="Describe lo que necesitas, fecha, hora preferida, etc..."
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        {/* Información de seguridad */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <p className="text-sm text-blue-700 font-medium">Tu seguridad es importante</p>
                          </div>
                          <ul className="text-xs text-blue-600 mt-1 space-y-1">
                            <li className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              No compartas información personal sensible
                            </li>
                            <li className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Acuerda el pago dentro de la plataforma
                            </li>
                            <li className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Reporta cualquier comportamiento inapropiado
                            </li>
                          </ul>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={handleSolicitar}
                          disabled={!mensaje.trim()}
                        >
                          Enviar solicitud
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServicios.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron servicios</h3>
          <p className="text-muted-foreground">
            Intenta con otros filtros o crea una solicitud personalizada
          </p>
        </div>
      )}

      {/* Modal de chat */}
      {isChatOpen && chatWithPrestador && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          prestador={chatWithPrestador}
          usuarioActual={user}
        />
      )}
    </div>
  );
}