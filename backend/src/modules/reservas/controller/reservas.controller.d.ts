import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
export declare class ReservasController {
    private readonly service;
    constructor(service: ReservasService);
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
    findHistorial(usuarioId: string): Promise<({
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
    findOne(id: string): Promise<{
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
    cancelar(id: string): Promise<{
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
    remove(id: string): Promise<{
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
