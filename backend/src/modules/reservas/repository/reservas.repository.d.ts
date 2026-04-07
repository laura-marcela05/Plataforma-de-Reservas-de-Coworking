import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
export declare class ReservasRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        usuario: {
            nombre: string;
            apellido: string;
            correo: string;
            contrasena: string;
            telefono: string | null;
            membresiaId: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        espacio: {
            sede: {
                nombre: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                direccion: string;
                horarioApertura: string;
                horarioCierre: string;
                capacidadTotal: number;
            };
        } & {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            capacidad: number;
            sedeId: number;
            tipoEspacioId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    })[]>;
    findOne(id: number): Promise<{
        usuario: {
            nombre: string;
            apellido: string;
            correo: string;
            contrasena: string;
            telefono: string | null;
            membresiaId: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        espacio: {
            sede: {
                nombre: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                direccion: string;
                horarioApertura: string;
                horarioCierre: string;
                capacidadTotal: number;
            };
        } & {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            capacidad: number;
            sedeId: number;
            tipoEspacioId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    }>;
    create(dto: CreateReservaDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    }>;
    cancelar(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    }>;
    findHistorial(usuarioId: number): Promise<({
        espacio: {
            sede: {
                nombre: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                direccion: string;
                horarioApertura: string;
                horarioCierre: string;
                capacidadTotal: number;
            };
        } & {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            capacidad: number;
            sedeId: number;
            tipoEspacioId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    })[]>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: number;
        espacioId: number;
        fecha: Date;
        horaInicio: Date;
        horaFin: Date;
        estado: string;
        fechaCreacion: Date;
    }>;
}
