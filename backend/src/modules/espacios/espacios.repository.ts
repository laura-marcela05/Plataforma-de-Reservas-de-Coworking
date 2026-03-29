import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Injectable()
export class EspaciosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(sedeId?: number) {
    return this.prisma.espacio.findMany({
      where: sedeId ? { sedeId } : {},
      include: { sede: true, tipoEspacio: true },
    });
  }

  async findOne(id: number) {
    const espacio = await this.prisma.espacio.findUnique({
      where: { id },
      include: { sede: true, tipoEspacio: true },
    });
    if (!espacio) throw new NotFoundException(`Espacio #${id} no encontrado`);
    return espacio;
  }

  async create(dto: CreateEspacioDto) {
    const sede = await this.prisma.sede.findUnique({
      where: { id: dto.sedeId },
    });
    if (!sede) throw new NotFoundException(`Sede #${dto.sedeId} no encontrada`);
    return this.prisma.espacio.create({ data: dto });
  }

  async update(id: number, dto: UpdateEspacioDto) {
    await this.findOne(id);
    return this.prisma.espacio.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.espacio.delete({ where: { id } });
  }
}
