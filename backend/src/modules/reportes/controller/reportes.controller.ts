import { Controller, Get, Query } from "@nestjs/common";
import { ReportesService } from "../service/reportes.service";

@Controller("reportes")
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  // Endpoint GET /reportes/ocupacion
  // Recibe los filtros como query params en la URL
  // Ejemplo: /reportes/ocupacion?sedeId=1&fechaInicio=2026-04-01&fechaFin=2026-04-30
  @Get("ocupacion")
  getOcupacion(
    @Query("sedeId") sedeId: string, // ID de la sede a filtrar
    @Query("fechaInicio") fechaInicio: string, // Fecha de inicio del periodo
    @Query("fechaFin") fechaFin: string, // Fecha de fin del periodo
  ) {
    // Convertimos sedeId a número con +sedeId y pasamos todo al service
    return this.service.getOcupacion(+sedeId, fechaInicio, fechaFin);
  }
}
