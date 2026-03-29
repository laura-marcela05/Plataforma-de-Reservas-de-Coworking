import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';

@Injectable()
export class MembresiasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.membresia.findMany();
  }

  async findOne(id: number) {
    const membresia = await this.prisma.membresia.findUnique({ where: { id } });
    if (!membresia)
      throw new NotFoundException(`Membresía #${id} no encontrada`);
    return membresia;
  }

  create(dto: CreateMembresiaDto) {
    return this.prisma.membresia.create({ data: dto });
  }

  async update(id: number, dto: UpdateMembresiaDto) {
    await this.findOne(id);
    return this.prisma.membresia.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.membresia.delete({ where: { id } });
  }
}
