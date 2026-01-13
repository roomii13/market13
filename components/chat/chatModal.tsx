"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  rol: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestador: Usuario;
  usuarioActual: Usuario;
}

export default function ChatModal({
  isOpen,
  onClose,
  prestador,
  usuarioActual,
}: ChatModalProps) {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoMensajes, setCargandoMensajes] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll al final
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Cargar mensajes cuando abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarMensajes();
    }
  }, [isOpen]);

  // Mantener actualizado el scroll
  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const cargarMensajes = async () => {
    try {
      setCargandoMensajes(true);
      const res = await fetch(
        `/api/chat?usuarioId=${usuarioActual.id}&prestadorId=${prestador.id}`
      );
      const data = await res.json();
      setMensajes(data);
    } catch (error) {
      console.error("Error cargando mensajes", error);
    } finally {
      setCargandoMensajes(false);
    }
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          usuarioId: usuarioActual.id,
          prestadorId: prestador.id,
          mensaje,
        }),
      });

      const data = await res.json();

      // Agregar mensaje recién enviado
      setMensajes((prev) => [...prev, data.mensaje]);

      setMensaje("");
      scrollToBottom();
    } catch (error) {
      console.error("Error enviando mensaje", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Chat con {prestador.nombre} {prestador.apellido}
          </DialogTitle>
        </DialogHeader>

        {/* Caja de mensajes */}
        <div
          className="border rounded-lg h-80 p-3 overflow-y-auto bg-gray-50"
          style={{ scrollBehavior: "smooth" }}
        >
          {cargandoMensajes && (
            <div className="text-center text-gray-500 py-10">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Cargando mensajes...
            </div>
          )}

          {!cargandoMensajes && mensajes.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No hay mensajes aún. ¡Empieza la conversación!
            </p>
          )}

          {!cargandoMensajes &&
            mensajes.map((m) => {
              const esMio = m.usuarioId === usuarioActual.id;

              return (
                <div
                  key={m.id}
                  className={`flex mb-2 ${
                    esMio ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs shadow-sm text-sm ${
                      esMio
                        ? "bg-blue-600 text-white"
                        : "bg-white border text-gray-800"
                    }`}
                  >
                    {m.mensaje}
                    <div className="text-[10px] text-right opacity-70 mt-1">
                      {new Date(m.fecha).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

          <div ref={chatEndRef} />
        </div>

        {/* Input + Botón enviar */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Escribe un mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          />

          <Button onClick={enviarMensaje} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
