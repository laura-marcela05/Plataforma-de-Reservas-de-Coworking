import { Injectable } from '@nestjs/common';
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
  cancelar(id: number) {
    return this.repository.cancelar(id);
  }
  findHistorial(usuarioId: number) {
    return this.repository.findHistorial(usuarioId);
  }
  remove(id: number) {
    return this.repository.remove(id);
  }
}
