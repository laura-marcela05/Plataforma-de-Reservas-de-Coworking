import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly service;
    constructor(service: UsuariosService);
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateUsuarioDto): Promise<{
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
    remove(id: string): Promise<{
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
