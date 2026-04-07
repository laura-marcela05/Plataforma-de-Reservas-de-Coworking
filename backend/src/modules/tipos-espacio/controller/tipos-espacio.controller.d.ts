import { TiposEspacioService } from "./tipos-espacio.service";
import { CreateTipoEspacioDto } from "../dto/create-tipo-espacio.dto";
import { UpdateTipoEspacioDto } from "../dto/update-tipo-espacio.dto";
export declare class TiposEspacioController {
  private readonly service;
  constructor(service: TiposEspacioService);
  findAll(): import("@prisma/client").Prisma.PrismaPromise<
    {
      nombre: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >;
  findOne(id: string): Promise<{
    nombre: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  create(
    dto: CreateTipoEspacioDto,
  ): import("@prisma/client").Prisma.Prisma__TipoEspacioClient<
    {
      nombre: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
    },
    never,
    import("@prisma/client/runtime/client").DefaultArgs,
    import("@prisma/client").Prisma.PrismaClientOptions
  >;
  update(
    id: string,
    dto: UpdateTipoEspacioDto,
  ): Promise<{
    nombre: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  remove(id: string): Promise<{
    nombre: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
