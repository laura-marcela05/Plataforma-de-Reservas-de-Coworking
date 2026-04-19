<<<<<<< HEAD
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';

@Injectable()
export class ReservasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toUtcTime(hhmm: string) {
    const [hours, minutes] = hhmm.split(':').map(Number);
    return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
  }

  private toMinutes(hhmm: string) {
    const [hours, minutes] = hhmm.split(':').map(Number);
    return hours * 60 + minutes;
  }

  findAll() {
    return this.prisma.reserva.findMany({
      include: {
        usuario: true,
        espacio: {
          include: { sede: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        usuario: true,
        espacio: {
          include: { sede: true },
        },
      },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva #${id} no encontrada`);
    }

    return reserva;
  }

  async create(dto: CreateReservaDto) {
    // HU‑05 → lógica de creación (NO SE TOCA)
    const espacio = await this.prisma.espacio.findUnique({
      where: { id: dto.espacioId },
      include: { sede: true },
    });

    if (!espacio) {
      throw new NotFoundException(
        `Espacio #${dto.espacioId} no encontrado`,
      );
    }

    const horaInicio = this.toUtcTime(dto.horaInicio);
    const horaFin = this.toUtcTime(dto.horaFin);
    const fecha = new Date(dto.fecha);

    const aperturaMin = this.toMinutes(espacio.sede.horarioApertura);
    const cierreMin = this.toMinutes(espacio.sede.horarioCierre);
    const inicioMin = this.toMinutes(dto.horaInicio);
    const finMin = this.toMinutes(dto.horaFin);

    if (inicioMin < aperturaMin || finMin > cierreMin) {
      throw new BadRequestException(
        `La reserva debe estar dentro del horario de la sede (${espacio.sede.horarioApertura}–${espacio.sede.horarioCierre})`,
      );
    }

    if (horaFin <= horaInicio) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la hora de inicio',
      );
    }

    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        espacioId: dto.espacioId,
        fecha,
        estado: 'activa',
        AND: [
          { horaInicio: { lt: horaFin } },
          { horaFin: { gt: horaInicio } },
        ],
      },
    });

    if (conflicto) {
      throw new BadRequestException(
        'El espacio ya tiene una reserva activa en ese horario',
      );
    }

    return this.prisma.reserva.create({
      data: {
        usuarioId: dto.usuarioId,
        espacioId: dto.espacioId,
        fecha,
        horaInicio,
        horaFin,
        fechaCreacion: new Date(),
        estado: 'activa',
      },
    });
  }

  // ✅ HU‑06 → SOLO persistencia, sin reglas de negocio
  async cancelarEstado(id: number) {
    return this.prisma.reserva.update({
      where: { id },
      data: { estado: 'cancelada' },
    });
  }

  async findHistorial(usuarioId: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: { usuarioId },
      include: {
        espacio: { include: { sede: true } },
      },
      orderBy: { fecha: 'desc' },
    });

    if (!reservas.length) {
      throw new NotFoundException(
        'El usuario no tiene reservas registradas',
      );
    }

    return reservas;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }
}
=======
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';

// Repository: maneja el acceso directo a la base de datos con Prisma.
// Aquí solo hay consultas y operaciones de persistencia.
@Injectable()
export class ReservasRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Devuelve todas las reservas incluyendo usuario y sede.
  findAll() {
    return this.prisma.reserva.findMany({
      include: {
        usuario: true,
        espacio: {
          include: { sede: true },
        },
      },
    });
  }

  // Busca una reserva por su ID. Lanza 404 si no existe.
  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        usuario: true,
        espacio: {
          include: { sede: true },
        },
      },
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva #${id} no encontrada`);
    }

    return reserva;
  }

  // Crea una reserva nueva después de validar horarios y conflictos.
  async create(dto: CreateReservaDto) {
    const fechaBase = '1970-01-01';
    const horaInicio = new Date(`${fechaBase}T${dto.horaInicio}:00`);
    const horaFin = new Date(`${fechaBase}T${dto.horaFin}:00`);
    const fecha = new Date(dto.fecha);

    if (horaFin <= horaInicio) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la hora de inicio',
      );
    }

    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        espacioId: dto.espacioId,
        fecha,
        estado: 'activa',
        AND: [
          { horaInicio: { lt: horaFin } },
          { horaFin: { gt: horaInicio } },
        ],
      },
    });

    if (conflicto) {
      throw new BadRequestException(
        'El espacio ya tiene una reserva activa en ese horario',
      );
    }

    return this.prisma.reserva.create({
      data: {
        usuarioId: dto.usuarioId,
        espacioId: dto.espacioId,
        fecha,
        horaInicio,
        horaFin,
        fechaCreacion: new Date(),
        estado: 'activa',
      },
    });
  }

  // Actualiza solo el estado de la reserva.
  async cancelarEstado(id: number) {
    return this.prisma.reserva.update({
      where: { id },
      data: { estado: 'cancelada' },
    });
  }

  // Devuelve el historial de reservas de un usuario, ordenado por fecha.
  async findHistorial(usuarioId: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: { usuarioId },
      include: {
        espacio: { include: { sede: true } },
      },
      orderBy: { fecha: 'desc' },
    });

    return reservas;
  }

  // Elimina una reserva después de verificar que existe.
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }
}
>>>>>>> 252584c (Fix: comentario en módulo de reservas y detalles, ademas de creacíon de archivo .gitattributes 19/04/2026 13:73)
