import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
    } & {
        nombre: string;
        apellido: string;
        correo: string;
        contrasena: string;
        telefono: string | null;
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
    } & {
        nombre: string;
        apellido: string;
        correo: string;
        contrasena: string;
        telefono: string | null;
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateUsuarioDto): Promise<{
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
    } & {
        nombre: string;
        apellido: string;
        correo: string;
        contrasena: string;
        telefono: string | null;
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateUsuarioDto): Promise<{
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
    } & {
        nombre: string;
        apellido: string;
        correo: string;
        contrasena: string;
        telefono: string | null;
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        apellido: string;
        correo: string;
        contrasena: string;
        telefono: string | null;
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
