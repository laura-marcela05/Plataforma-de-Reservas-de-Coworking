import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateReservaDto } from "../dto/create-reserva.dto";

// Repository: maneja el acceso directo a la base de datos con Prisma.
@Injectable()
export class ReservasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toUtcTime(hhmm: string) {
    const [hours, minutes] = hhmm.split(":").map(Number);
    return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
  }

  private toMinutes(hhmm: string) {
    const [hours, minutes] = hhmm.split(":").map(Number);
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

  // HU-05 → creación de reserva con validaciones completas
  async create(dto: CreateReservaDto) {
    const espacio = await this.prisma.espacio.findUnique({
      where: { id: dto.espacioId },
      include: { sede: true },
    });

    if (!espacio) {
      throw new NotFoundException(`Espacio #${dto.espacioId} no encontrado`);
    }

    const fecha = new Date(`${dto.fecha}T00:00:00`);
    const inicioReserva = new Date(`${dto.fecha}T${dto.horaInicio}:00`);
    const ahora = new Date();
    const horaInicio = this.toUtcTime(dto.horaInicio);
    const horaFin = this.toUtcTime(dto.horaFin);

    if (inicioReserva <= ahora) {
      throw new BadRequestException(
        "La reserva debe iniciar después de la fecha y hora actuales",
      );
    }

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
        "La hora de fin debe ser posterior a la hora de inicio",
      );
    }

    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        espacioId: dto.espacioId,
        fecha,
        estado: "activa",
        AND: [{ horaInicio: { lt: horaFin } }, { horaFin: { gt: horaInicio } }],
      },
    });

    if (conflicto) {
      throw new BadRequestException(
        "El espacio ya tiene una reserva activa en ese horario",
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
        estado: "activa",
      },
    });
  }

  // HU-06 → solo persistencia
  async cancelarEstado(id: number) {
    return this.prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });
  }

  async findHistorial(usuarioId: number) {
    const reservas = await this.prisma.reserva.findMany({
      where: { usuarioId },
      include: {
        usuario: true,
        espacio: { include: { sede: true } },
      },
      orderBy: [
        { fecha: "desc" },
        { horaInicio: "desc" },
        { createdAt: "desc" },
      ],
    });

    if (!reservas.length) {
      throw new NotFoundException("El usuario no tiene reservas registradas");
    }

    return reservas;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }

  // HU-07 → auto-finaliza reservas expiradas
  async finalizarReservasExpiradas() {
    const ahora = new Date();

    // Encuentra todas las reservas activas donde la fecha+horaFin ya pasó
    const reservasExpiradas = await this.prisma.reserva.findMany({
      where: {
        estado: "activa",
        OR: [
          {
            // fecha anterior a hoy
            fecha: { lt: ahora },
          },
          {
            // fecha = hoy AND horaFin <= ahora
            AND: [
              { fecha: { equals: new Date(ahora.toDateString()) } },
              { horaFin: { lte: ahora } },
            ],
          },
        ],
      },
    });

    if (reservasExpiradas.length === 0) {
      return {
        mensaje: "No hay reservas expiradas para finalizar",
        actualizadas: 0,
      };
    }

    // Marca todas como finalizada
    await this.prisma.reserva.updateMany({
      where: {
        id: { in: reservasExpiradas.map((r) => r.id) },
      },
      data: { estado: "finalizada" },
    });

    return {
      mensaje: `${reservasExpiradas.length} reserva(s) expirada(s) finalizada(s)`,
      actualizadas: reservasExpiradas.length,
    };
  }

  // HU-10: Listado de reservas activas del día para una sede
  async findActivasDelDia(sedeId: number, fecha: string) {
    // Convertimos la fecha string a Date para la query
    const fechaDate = new Date(`${fecha}T00:00:00`);

    const reservas = await this.prisma.reserva.findMany({
      where: {
        estado: "activa",
        fecha: fechaDate,
        // Filtramos por sede a través de la relación con espacio
        espacio: { sedeId },
      },
      include: {
        // Traemos datos del usuario para mostrar nombre y apellido
        usuario: true,
        // Traemos datos del espacio con su sede y tipo
        espacio: { include: { sede: true, tipoEspacio: true } },
      },
      // Ordenamos por hora de inicio para ver las más próximas primero
      orderBy: { horaInicio: "asc" },
    });

    return reservas;
  }
}
