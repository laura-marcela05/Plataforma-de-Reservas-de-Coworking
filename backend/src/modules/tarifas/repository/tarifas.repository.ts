import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';

@Injectable()
export class TarifasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async validarRelaciones(tipoEspacioId: number, membresiaId: number) {
    const [tipoEspacio, membresia] = await Promise.all([
      this.prisma.tipoEspacio.findUnique({ where: { id: tipoEspacioId } }),
      this.prisma.membresia.findUnique({ where: { id: membresiaId } }),
    ]);

    if (!tipoEspacio) {
      throw new NotFoundException(`Tipo de espacio #${tipoEspacioId} no encontrado`);
    }

    if (!membresia) {
      throw new NotFoundException(`Membresía #${membresiaId} no encontrada`);
    }
  }

  findAll() {
    return this.prisma.tarifa.findMany({
      include: { tipoEspacio: true, membresia: true },
    });
  }

  async findOne(id: number) {
    const tarifa = await this.prisma.tarifa.findUnique({
      where: { id },
      include: { tipoEspacio: true, membresia: true },
    });
    if (!tarifa) throw new NotFoundException(`Tarifa #${id} no encontrada`);
    return tarifa;
  }

  async create(dto: CreateTarifaDto) {
    await this.validarRelaciones(dto.tipoEspacioId, dto.membresiaId);

    const existe = await this.prisma.tarifa.findUnique({
      where: {
        tipoEspacioId_membresiaId: {
          tipoEspacioId: dto.tipoEspacioId,
          membresiaId: dto.membresiaId,
        },
      },
    });
    if (existe)
      throw new ConflictException('Ya existe una tarifa para esa combinación');
    return this.prisma.tarifa.create({ data: dto });
  }

  async update(id: number, dto: UpdateTarifaDto) {
    const actual = await this.findOne(id);

    const tipoEspacioId = dto.tipoEspacioId ?? actual.tipoEspacioId;
    const membresiaId = dto.membresiaId ?? actual.membresiaId;

    await this.validarRelaciones(tipoEspacioId, membresiaId);

    const existe = await this.prisma.tarifa.findFirst({
      where: {
        tipoEspacioId,
        membresiaId,
        NOT: { id },
      },
    });

    if (existe) {
      throw new ConflictException('Ya existe una tarifa para esa combinación');
    }

    return this.prisma.tarifa.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.tarifa.delete({ where: { id } });
  }
}
