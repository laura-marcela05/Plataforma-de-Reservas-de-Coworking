import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Tarifa } from "@/interfaces/tarifa.interface";

export interface TarifaConRelaciones extends Tarifa {
  tipoEspacio: {
    id: number;
    nombre: string;
  };
  membresia: {
    id: number;
    tipo: string;
  };
}

export type CreateTarifaDto = Omit<Tarifa, "id" | "createdAt" | "updatedAt">;
export type UpdateTarifaDto = Partial<CreateTarifaDto>;

export const tarifasService = {
  findAll: () => apiGet<TarifaConRelaciones[]>("/tarifas"),
  findOne: (id: number) => apiGet<TarifaConRelaciones>(`/tarifas/${id}`),
  create: (data: CreateTarifaDto) => apiPost<Tarifa>("/tarifas", data),
  update: (id: number, data: UpdateTarifaDto) =>
    apiPut<Tarifa>(`/tarifas/${id}`, data),
  remove: (id: number) => apiDelete<void>(`/tarifas/${id}`),
};
