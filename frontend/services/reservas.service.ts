import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { Reserva } from "@/interfaces/reserva.interface";

export interface ReservaHistorial extends Reserva {
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  espacio: {
    id: number;
    nombre: string;
    descripcion?: string;
    sedeId: number;
    tipoEspacio?: { id: number; nombre: string };
    sede: { id: number; nombre: string; direccion?: string };
  };
}

export interface ReservaActivaDia {
  id: number;
  estado: "activa" | "cancelada" | "finalizada";
  horaInicio: string;
  horaFin: string;
  usuario: { id: number; nombre: string; apellido: string };
  espacio: { id: number; nombre: string };
}

export interface ReservasActivasResponse {
  total: number;
  reservas: ReservaActivaDia[];
  mensaje?: string;
}

// ✅ HU-05: estado lo asigna automáticamente el backend ("activa")
export type CreateReservaDto = Omit<
  Reserva,
  "id" | "estado" | "fechaCreacion" | "createdAt" | "updatedAt"
>;

export type UpdateReservaDto = Partial<CreateReservaDto>;

export const reservasService = {
  findAll: () => apiGet<Reserva[]>("/reservas"),

  findOne: (id: number) => apiGet<Reserva>(`/reservas/${id}`),

  findHistorial: (usuarioId: number) =>
    apiGet<ReservaHistorial[]>(`/reservas/historial?usuarioId=${usuarioId}`),

  create: (data: CreateReservaDto) => apiPost<Reserva>("/reservas", data),

  cancelar: (id: number) => apiPatch<Reserva>(`/reservas/${id}/cancelar`),

  remove: (id: number) => apiDelete<void>(`/reservas/${id}`),

  // Finaliza automáticamente las reservas cuya fecha y hora ya pasaron
  finalizarExpiradas: () => apiGet<void>("/reservas/finalize-expired"),

  // HU-10: obtiene las reservas activas del día para una sede
  findActivasDelDia: (sedeId: number, fecha?: string) => {
    const params = new URLSearchParams({
      sedeId: sedeId.toString(),
      ...(fecha && { fecha }),
    });
    return apiGet<ReservasActivasResponse>(
      `/reservas/activas?${params.toString()}`,
    );
  },
};
