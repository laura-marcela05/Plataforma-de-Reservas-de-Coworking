import { IsInt, IsDateString, IsString } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  espacioId: number;

  @IsDateString()
  fecha: string;

  @IsString()
  horaInicio: string;

  @IsString()
  horaFin: string;
}
