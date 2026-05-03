import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ReportesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOcupacion(sedeId: number, fechaInicio: string, fechaFin: string) {
    // Convertimos las fechas de string a Date para que Prisma las entienda
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Buscamos todas las reservas que cumplan 3 condiciones:
    // 1. Estado activa
    // 2. Que el espacio pertenezca a la sede enviada
    // 3. Que la fecha esté dentro del rango fechaInicio - fechaFin
    const reservas = await this.prisma.reserva.findMany({
      where: {
        estado: "activa",
        espacio: { sedeId }, // filtra por sede a través de la relación con espacio
        fecha: { gte: inicio, lte: fin }, // gte = mayor o igual, lte = menor o igual
      },
      include: { espacio: true }, // traemos los datos del espacio para mostrar su nombre
    });

    return reservas;
  }
}
