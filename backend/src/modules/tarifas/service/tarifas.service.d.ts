import { TarifasRepository } from "./tarifas.repository";
import { CreateTarifaDto } from "../dto/create-tarifa.dto";
import { UpdateTarifaDto } from "../dto/update-tarifa.dto";
export declare class TarifasService {
  private readonly repository;
  constructor(repository: TarifasRepository);
  findAll(): import("@prisma/client").Prisma.PrismaPromise<
    ({
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
    })[]
  >;
  findOne(id: number): Promise<
    {
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
    }
  >;
  create(dto: CreateTarifaDto): Promise<{
    membresiaId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    tipoEspacioId: number;
    precioHora: number;
  }>;
  update(
    id: number,
    dto: UpdateTarifaDto,
  ): Promise<{
    membresiaId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    tipoEspacioId: number;
    precioHora: number;
  }>;
  remove(id: number): Promise<{
    membresiaId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    tipoEspacioId: number;
    precioHora: number;
  }>;
}
