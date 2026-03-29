import { Injectable } from '@nestjs/common';
import { EspaciosRepository } from './espacios.repository';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Injectable()
export class EspaciosService {
  constructor(private readonly repository: EspaciosRepository) {}

  findAll(sedeId?: number) {
    return this.repository.findAll(sedeId);
  }
  findOne(id: number) {
    return this.repository.findOne(id);
  }
  create(dto: CreateEspacioDto) {
    return this.repository.create(dto);
  }
  update(id: number, dto: UpdateEspacioDto) {
    return this.repository.update(id, dto);
  }
  remove(id: number) {
    return this.repository.remove(id);
  }
}
