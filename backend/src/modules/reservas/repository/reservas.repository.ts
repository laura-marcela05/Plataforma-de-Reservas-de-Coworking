import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateReservaDto } from "../dto/create-reserva.dto";

@Injectable()
export class ReservasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reserva.findMany({
      include: { usuario: true, espacio: { include: { sede: true } } },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: { usuario: true, espacio: { include: { sede: true } } },
    });
    if (!reserva) throw new NotFoundException(`Reserva #${id} no encontrada`);
    return reserva;
  }

  async create(dto: CreateReservaDto) {
    // Convertir "HH:mm" a Date usando fecha base neutra para @db.Time
    const fechaBase = "1970-01-01";
    const horaInicio = new Date(`${fechaBase}T${dto.horaInicio}:00`);
    const horaFin = new Date(`${fechaBase}T${dto.horaFin}:00`);
    const fecha = new Date(dto.fecha);

    if (horaFin <= horaInicio)
      throw new BadRequestException(
        "La hora de fin debe ser posterior a la hora de inicio",
      );

    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        espacioId: dto.espacioId,
        fecha,
        estado: "activa",
        AND: [{ horaInicio: { lt: horaFin } }, { horaFin: { gt: horaInicio } }],
      },
    });

    if (conflicto)
      throw new BadRequestException(
        "El espacio ya tiene una reserva activa en ese horario",
      );

    return this.prisma.reserva.create({
      data: {
        usuarioId: dto.usuarioId,
        espacioId: dto.espacioId,
        fecha,
        horaInicio,
        horaFin,
        fechaCreacion: new Date(),
        estado: "activa",
      },
    });
  }

  async cancelar(id: number) {
    const reserva = await this.findOne(id);

    if (reserva.estado !== "activa")
      throw new BadRequestException("Solo se pueden cancelar reservas activas");

    const ahora = new Date();
    const fechaStr = reserva.fecha.toISOString().split("T")[0];
    const horaStr = reserva.horaInicio.toISOString().split("T")[1].slice(0, 5);
    const inicio = new Date(`${fechaStr}T${horaStr}:00`);
    const diffHoras = (inicio.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diffHoras < 2)
      throw new BadRequestException(
        "Se necesitan al menos 2 horas de anticipación para cancelar",
      );

    return this.prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });
  }

  async findHistorial(usuarioId: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: { usuarioId },
      include: { espacio: { include: { sede: true } } },
      orderBy: { fecha: "desc" },
    });
    if (!reservas.length)
      throw new NotFoundException("El usuario no tiene reservas registradas");
    return reservas;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }
}
