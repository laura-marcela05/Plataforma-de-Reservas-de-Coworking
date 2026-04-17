import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReservasRepository } from '../repository/reservas.repository';
import { CreateReservaDto } from '../dto/create-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(private readonly repository: ReservasRepository) {}

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  create(dto: CreateReservaDto) {
    return this.repository.create(dto);
  }

  async cancelar(id: number) {
    const reserva = await this.repository.findOne(id);

    if (reserva.estado !== 'activa') {
      throw new BadRequestException(
        'Solo se pueden cancelar reservas activas',
      );
    }

    const ahora = new Date();

    const fechaStr = reserva.fecha.toISOString().split('T')[0];
    const horaStr = reserva.horaInicio
      .toISOString()
      .split('T')[1]
      .slice(0, 5);

    const inicio = new Date(`${fechaStr}T${horaStr}:00`);
    const diffHoras =
      (inicio.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diffHoras < 2) {
      throw new BadRequestException(
        'Se necesitan al menos 2 horas de anticipación para cancelar',
      );
    }

    return this.repository.cancelarEstado(id);
  }

  findHistorial(usuarioId: number) {
    return this.repository.findHistorial(usuarioId);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }
}