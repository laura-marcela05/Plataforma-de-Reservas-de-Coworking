import { Injectable, BadRequestException } from "@nestjs/common";
import { ReportesRepository } from "../repository/reportes.repository";

@Injectable()
export class ReportesService {
  constructor(private readonly repository: ReportesRepository) {}

  async getOcupacion(sedeId: number, fechaInicio: string, fechaFin: string) {
    // Validamos que los tres parámetros lleguen, si falta alguno lanzamos error
    if (!sedeId || !fechaInicio || !fechaFin) {
      throw new BadRequestException(
        "Debe enviar sedeId, fechaInicio y fechaFin",
      );
    }

    // Validamos que la fecha de fin no sea anterior a la de inicio
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      throw new BadRequestException(
        "La fecha de fin debe ser posterior a la de inicio",
      );
    }

    // Llamamos al repository para obtener las reservas del periodo
    const reservas = await this.repository.getOcupacion(
      sedeId,
      fechaInicio,
      fechaFin,
    );

    // Si no hay reservas en ese periodo retornamos un mensaje informativo
    if (reservas.length === 0) {
      return {
        mensaje: "No hay reservas en el periodo seleccionado.",
        total: 0,
      };
    }

    // Construimos un objeto para contar cuántas reservas tiene cada espacio
    // La clave es el ID del espacio y el valor es su nombre y su conteo
    const conteo: Record<number, { nombre: string; total: number }> = {};

    for (const reserva of reservas) {
      const id = reserva.espacioId;

      // Si el espacio aún no está en el conteo lo inicializamos
      if (!conteo[id]) {
        conteo[id] = { nombre: reserva.espacio.nombre, total: 0 };
      }

      // Sumamos 1 cada vez que aparece ese espacio en las reservas
      conteo[id].total++;
    }

    // Convertimos el objeto a un array, lo ordenamos de mayor a menor
    // y tomamos solo los 5 espacios más utilizados
    const espaciosMasUsados = Object.values(conteo)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Retornamos el total de reservas y los espacios más usados
    return {
      total: reservas.length,
      espaciosMasUsados,
    };
  }
}
