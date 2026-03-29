import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sede.findMany();
  }

  async findOne(id: number) {
    const sede = await this.prisma.sede.findUnique({ where: { id } });
    if (!sede) throw new NotFoundException(`Sede #${id} no encontrada`);
    return sede;
  }

  async create(dto: CreateSedeDto) {
    const existe = await this.prisma.sede.findUnique({
      where: { nombre: dto.nombre },
    });
    if (existe) throw new ConflictException('El nombre de la sede ya existe');
    return this.prisma.sede.create({ data: dto });
  }

  async update(id: number, dto: UpdateSedeDto) {
    await this.findOne(id);
    return this.prisma.sede.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sede.delete({ where: { id } });
  }
}
