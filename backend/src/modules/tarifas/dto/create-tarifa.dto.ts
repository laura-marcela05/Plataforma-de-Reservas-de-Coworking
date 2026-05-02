import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTarifaDto {
  @IsNumber()
  @IsPositive()
  precioHora: number;

  @IsInt()
  tipoEspacioId: number;

  @IsInt()
  membresiaId: number;
}
