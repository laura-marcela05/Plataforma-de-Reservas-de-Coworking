import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';
export declare class TarifasController {
    private readonly service;
    constructor(service: TarifasService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
        tipoEspacio: {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipoEspacioId: number;
        precioHora: number;
    })[]>;
    findOne(id: string): Promise<{
        membresia: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            tipo: string;
        };
        tipoEspacio: {
            nombre: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipoEspacioId: number;
        precioHora: number;
    }>;
    create(dto: CreateTarifaDto): Promise<{
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipoEspacioId: number;
        precioHora: number;
    }>;
    update(id: string, dto: UpdateTarifaDto): Promise<{
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipoEspacioId: number;
        precioHora: number;
    }>;
    remove(id: string): Promise<{
        membresiaId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        tipoEspacioId: number;
        precioHora: number;
    }>;
}
