import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ReservasService } from "../service/reservas.service";
import { CreateReservaDto } from "../dto/create-reserva.dto";

// Controller para el módulo de reservas.
// Define las rutas HTTP que el frontend puede invocar.
@Controller("reservas")
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  // GET /reservas
  // Devuelve todas las reservas registradas.
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET /reservas/historial?usuarioId=123
  // Devuelve el historial de reservas de un usuario.
  // IMPORTANTE: debe ir antes de @Get(':id') para que NestJS
  // no confunda "historial" con un ID numérico.
  @Get("historial")
  findHistorial(@Query("usuarioId", ParseIntPipe) usuarioId: number) {
    return this.service.findHistorial(usuarioId);
  }

  // GET /reservas/finalize-expired
  // Finaliza automáticamente todas las reservas expiradas.
  // IMPORTANTE: debe ir antes de @Get(':id') por la misma razón.
  @Get("finalize-expired")
  finalizarExpiradas() {
    return this.service.finalizarExpiradas();
  }

  // GET /reservas/activas?sedeId=1&fecha=2026-04-17
  // Retorna las reservas activas del día para una sede.
  // HU-10: IMPORTANTE: debe ir antes de @Get(':id') para que NestJS
  // no confunda la palabra "activas" con un ID.
  @Get("activas")
  findActivasDelDia(
    @Query("sedeId", ParseIntPipe) sedeId: number,
    @Query("fecha") fecha?: string,
  ) {
    return this.service.findActivasDelDia(sedeId, fecha);
  }

  // GET /reservas/:id
  // Retorna los detalles de una reserva específica.
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  // POST /reservas
  // Crea una nueva reserva usando los datos enviados.
  @Post()
  create(@Body() dto: CreateReservaDto) {
    return this.service.create(dto);
  }

  // PATCH /reservas/:id/cancelar
  // Cancela una reserva activa si cumple la regla de anticipación.
  @Patch(":id/cancelar")
  cancelar(@Param("id") id: string) {
    return this.service.cancelar(+id);
  }

  // DELETE /reservas/:id
  // Elimina una reserva por su ID.
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
