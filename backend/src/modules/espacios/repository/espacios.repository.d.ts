import { PrismaService } from '../../prisma/prisma.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';
export declare class EspaciosRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(sedeId?: number): import("@prisma/client").Prisma.PrismaPromise<({
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
        tipoEspacio: {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    })[]>;
    findOne(id: number): Promise<{
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
        tipoEspacio: {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
    create(dto: CreateEspacioDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
    update(id: number, dto: UpdateEspacioDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
}
