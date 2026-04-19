import { IsInt, IsDateString, IsString } from 'class-validator';

// DTO para crear una reserva.
// Valida los datos que vienen desde el frontend.
export class CreateReservaDto {
  @IsInt()
  // ID del usuario que solicita la reserva.
  usuarioId: number;

  @IsInt()
  // ID del espacio que se quiere reservar.
  espacioId: number;

  @IsDateString()
  // Fecha de la reserva en formato válido.
  fecha: string;

  @IsString()
  // Hora de inicio en formato 'HH:mm'.
  horaInicio: string;

  @IsString()
  // Hora de fin en formato 'HH:mm'.
  horaFin: string;
}
