"use client";

import { useEffect, useState } from "react";
import { reportesService } from "@/services/reportes.service";
import { sedesService } from "@/services/sedes.service";
import type { Sede } from "@/interfaces/sede.interface";
import type {
  EspacioReporte,
  ReporteOcupacion,
} from "@/interfaces/reporte.interface";

export default function ReportesPage() {
  // Lista de sedes para el selector
  const [sedes, setSedes] = useState<Sede[]>([]);

  // Filtros del formulario
  const [sedeId, setSedeId] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  // Estados del reporte
  const [reporte, setReporte] = useState<ReporteOcupacion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargamos las sedes al montar la página
  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const data = await sedesService.findAll();
        setSedes(data);
      } catch {
        // No bloqueamos la pantalla si falla
      }
    };
    cargarSedes();
  }, []);

  const generarReporte = async () => {
    // Limpiamos estados anteriores
    setError(null);
    setMensaje(null);
    setReporte(null);

    // Validaciones del lado del cliente
    if (!sedeId || !fechaInicio || !fechaFin) {
      setError("Debe seleccionar sede, fecha de inicio y fecha de fin.");
      return;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      setError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    try {
      setCargando(true);
      const data = await reportesService.getOcupacion(
        Number(sedeId),
        fechaInicio,
        fechaFin,
      );

      // Si el backend retorna mensaje significa que no hay reservas
      if (data.mensaje) {
        setMensaje(data.mensaje);
      } else {
        setReporte(data);
      }
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Error al generar el reporte.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================
        CARD: FILTROS
       ======================== */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* HEADER CON ICONO (REPORTES / ANALYTICS) */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 4 4 5-6" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Reporte de ocupación
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Filtra por sede y periodo para ver el total de reservas y los
                espacios más utilizados.
              </p>
            </div>
          </div>

          {/* FILTROS */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Sede */}
            <div>
              <label className="text-xs font-medium text-gray-600">Sede</label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Fecha inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="text-xs font-medium text-gray-600">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* BOTÓN */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={generarReporte}
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando ? "Generando..." : "Generar reporte"}
            </button>
          </div>

          {/* ERROR */}
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          {/* MENSAJE */}
          {mensaje && <p className="mt-3 text-sm text-gray-600">{mensaje}</p>}
        </div>
      </section>

      {/* ========================
        CARD: RESULTADOS
       ======================== */}
      {reporte && (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Resultados</h2>

            {/* TOTAL */}
            <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-600 font-medium uppercase">
                Total de reservas
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {reporte.total}
              </p>
            </div>

            {/* TABLA */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Espacios más utilizados
              </h3>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-gray-600">#</th>
                      <th className="text-left p-3 text-gray-600">Espacio</th>
                      <th className="text-left p-3 text-gray-600">
                        Total reservas
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reporte.espaciosMasUsados.map(
                      (e: EspacioReporte, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-3 text-gray-500">{index + 1}</td>
                          <td className="p-3 font-medium">{e.nombre}</td>
                          <td className="p-3">{e.total}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
