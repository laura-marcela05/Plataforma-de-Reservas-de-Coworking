import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Espacio } from "@/interfaces/espacio.interface";

export type CreateEspacioDto = Omit<Espacio, "id" | "createdAt" | "updatedAt">;
export type UpdateEspacioDto = Partial<CreateEspacioDto>;

export const espaciosService = {
  findAll: () => apiGet<Espacio[]>("/espacios"),
  findOne: (id: number) => apiGet<Espacio>(`/espacios/${id}`),
  create: (data: CreateEspacioDto) => apiPost<Espacio>("/espacios", data),
  update: (id: number, data: UpdateEspacioDto) =>
    apiPut<Espacio>(`/espacios/${id}`, data),
  remove: (id: number) => apiDelete<void>(`/espacios/${id}`),
};
