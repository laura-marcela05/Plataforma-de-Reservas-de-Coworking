import { TiposEspacioRepository } from './tipos-espacio.repository';
import { CreateTipoEspacioDto } from './dto/create-tipo-espacio.dto';
import { UpdateTipoEspacioDto } from './dto/update-tipo-espacio.dto';
export declare class TiposEspacioService {
    private readonly repository;
    constructor(repository: TiposEspacioRepository);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateTipoEspacioDto): import("@prisma/client").Prisma.Prisma__TipoEspacioClient<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateTipoEspacioDto): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        nombre: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
