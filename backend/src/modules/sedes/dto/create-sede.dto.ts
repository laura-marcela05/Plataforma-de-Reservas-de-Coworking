import { IsString, IsInt } from 'class-validator';

export class CreateSedeDto {
  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsString()
  horarioApertura: string;

  @IsString()
  horarioCierre: string;

  @IsInt()
  capacidadTotal: number;
}
