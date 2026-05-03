// Service de reportes — consume el endpoint GET /reportes/ocupacion
// Usa el cliente HTTP centralizado (apiGet) que agrega automáticamente /api/v1
import { apiGet } from "@/lib/api";
import type { ReporteOcupacion } from "@/interfaces/reporte.interface";

export const reportesService = {
  // Genera un reporte de ocupación filtrado por sede y rango de fechas
  // sedeId: ID de la sede a consultar
  // fechaInicio: fecha de inicio del periodo en formato YYYY-MM-DD
  // fechaFin: fecha de fin del periodo en formato YYYY-MM-DD
  getOcupacion: (sedeId: number, fechaInicio: string, fechaFin: string) =>
    apiGet<ReporteOcupacion>(
      `/reportes/ocupacion?sedeId=${sedeId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    ),
};
