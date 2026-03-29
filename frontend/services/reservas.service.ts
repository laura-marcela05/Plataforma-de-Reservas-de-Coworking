import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Reserva } from "@/interfaces/reserva.interface";

export type CreateReservaDto = Omit<
  Reserva,
  "id" | "fechaCreacion" | "createdAt" | "updatedAt"
>;
export type UpdateReservaDto = Partial<CreateReservaDto>;

export const reservasService = {
  findAll: () => apiGet<Reserva[]>("/reservas"),
  findOne: (id: number) => apiGet<Reserva>(`/reservas/${id}`),
  create: (data: CreateReservaDto) => apiPost<Reserva>("/reservas", data),
  cancelar: (id: number) => apiPut<Reserva>(`/reservas/${id}/cancelar`, {}),
  remove: (id: number) => apiDelete<void>(`/reservas/${id}`),
};
