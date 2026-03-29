import { IsString, IsEmail, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsString()
  contrasena: string;

  @IsString()
  telefono: string;

  @IsInt()
  membresiaId: number;
}
