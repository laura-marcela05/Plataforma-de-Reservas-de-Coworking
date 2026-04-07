import { SedesRepository } from './sedes.repository';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
export declare class SedesService {
    private readonly repository;
    constructor(repository: SedesRepository);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        direccion: string;
        horarioApertura: string;
        horarioCierre: string;
        capacidadTotal: number;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        direccion: string;
        horarioApertura: string;
        horarioCierre: string;
        capacidadTotal: number;
    }>;
    create(dto: CreateSedeDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        direccion: string;
        horarioApertura: string;
        horarioCierre: string;
        capacidadTotal: number;
    }>;
    update(id: number, dto: UpdateSedeDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        direccion: string;
        horarioApertura: string;
        horarioCierre: string;
        capacidadTotal: number;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        direccion: string;
        horarioApertura: string;
        horarioCierre: string;
        capacidadTotal: number;
    }>;
}
