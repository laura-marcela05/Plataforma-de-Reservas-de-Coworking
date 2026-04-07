import { PrismaService } from '../../prisma/prisma.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { UpdateMembresiaDto } from './dto/update-membresia.dto';
export declare class MembresiasRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipo: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipo: string;
    }>;
    create(dto: CreateMembresiaDto): import("@prisma/client").Prisma.Prisma__MembresiaClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipo: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateMembresiaDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipo: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipo: string;
    }>;
}
