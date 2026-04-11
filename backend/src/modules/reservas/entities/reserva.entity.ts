export class ReservaEntity {
  id!: number;
  usuarioId!: number;
  espacioId!: number;
  fecha!: Date;
  horaInicio!: Date;
  horaFin!: Date;
  estado!: string;
  fechaCreacion!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
