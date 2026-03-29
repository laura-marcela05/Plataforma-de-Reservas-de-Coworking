import { IsString, IsInt } from 'class-validator';

export class CreateEspacioDto {
  @IsString()
  nombre: string;

  @IsInt()
  capacidad: number;

  @IsInt()
  sedeId: number;

  @IsInt()
  tipoEspacioId: number;
}
