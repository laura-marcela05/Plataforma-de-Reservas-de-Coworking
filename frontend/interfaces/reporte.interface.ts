// Representa cada espacio en el resultado del reporte
export interface EspacioReporte {
  nombre: string;
  total: number;
}

// Representa la respuesta completa del reporte de ocupación
export interface ReporteOcupacion {
  total: number;
  espaciosMasUsados: EspacioReporte[];
  mensaje?: string; // Solo llega cuando no hay reservas
}
