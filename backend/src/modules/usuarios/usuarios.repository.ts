import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Devuelve todos los usuarios incluyendo membresía
  findAll() {
    return this.prisma.usuario.findMany({
      include: { membresia: true }, // ahora seguro porque membresiaId es obligatorio
    });
  }

  // Devuelve un usuario por ID
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { membresia: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  // Crear usuario con validación de correo y membresía
  async create(dto: CreateUsuarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (existe) throw new ConflictException('El correo ya está registrado');

    // Asegúrate de enviar membresiaId en el DTO
    return this.prisma.usuario.create({
      data: {
        ...dto,
        membresiaId: dto.membresiaId, // obligatorio
      },
      include: { membresia: true },
    });
  }

  // Actualizar usuario
  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      include: { membresia: true },
    });
  }

  // Eliminar usuario
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({ where: { id } });
  }
}
