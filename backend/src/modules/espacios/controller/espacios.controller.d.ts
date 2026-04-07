import { EspaciosService } from './espacios.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';
export declare class EspaciosController {
    private readonly service;
    constructor(service: EspaciosService);
    findAll(sedeId?: string): import("@prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateEspacioDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
    remove(id: string): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        capacidad: number;
        sedeId: number;
        tipoEspacioId: number;
    }>;
}
