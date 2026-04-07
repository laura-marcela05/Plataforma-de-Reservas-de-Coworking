import { SedesService } from "./sedes.service";
import { CreateSedeDto } from "../dto/create-sede.dto";
import { UpdateSedeDto } from "../dto/update-sede.dto";
export declare class SedesController {
  private readonly service;
  constructor(service: SedesService);
  findAll(): import("@prisma/client").Prisma.PrismaPromise<
    {
      nombre: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
      direccion: string;
      horarioApertura: string;
      horarioCierre: string;
      capacidadTotal: number;
    }[]
  >;
  findOne(id: string): Promise<{
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
  update(
    id: string,
    dto: UpdateSedeDto,
  ): Promise<{
    nombre: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    direccion: string;
    horarioApertura: string;
    horarioCierre: string;
    capacidadTotal: number;
  }>;
  remove(id: string): Promise<{
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
