"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { reservasService } from "@/services/reservas.service";
import { sedesService } from "@/services/sedes.service";

interface Sede {
  id: number;
  nombre: string;
}

// =========================
// Helper hora
// =========================
const formatHora = (hora: string) => {
  const match = hora.match(/T(\d{2}:\d{2})/);
  if (match) return match[1];

  if (/^\d{2}:\d{2}/.test(hora)) return hora.slice(0, 5);

  const parsed = new Date(hora);
  return Number.isNaN(parsed.getTime())
    ? hora
    : parsed.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
};

export default function ReservasActivasPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sedeId, setSedeId] = useState<number | "">("");

  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [accionError, setAccionError] = useState<string | null>(null);

  const getErrorMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return null;
  };

  useEffect(() => {
    cargarSedes();
  }, []);

  const cargarSedes = async () => {
    try {
      const data = await sedesService.findAll();
      setSedes(data);
    } catch {
      setError("Error cargando sedes");
    }
  };

  const consultar = async () => {
    setAccionError(null);

    if (!sedeId) {
      setAccionError("Selecciona una sede");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await reservasService.findActivasDelDia(Number(sedeId));

      setReservas(res.reservas || []);

      if (res.reservas.length === 0) {
        setAccionError("No hay reservas activas para esta sede");
      }
    } catch (e: unknown) {
      setAccionError(getErrorMessage(e) || "Error al consultar reservas");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          CARD: RESERVAS ACTIVAS
         ========================= */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reservas activas del día
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Consulta la ocupación en tiempo real por sede
                </p>
              </div>
            </div>

            {/* VOLVER */}
            <Link
              href="/reservas"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              ← Volver
            </Link>
          </div>

          {/* FILTRO */}
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sede
                </label>

                <select
                  value={sedeId}
                  onChange={(e) => setSedeId(Number(e.target.value))}
                  className="mt-1 block border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione sede</option>
                  {sedes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={consultar}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Consultar
              </button>
            </div>
          </div>

          {/* ERROR / MENSAJES */}
          {accionError && (
            <p className="text-sm text-red-500 mt-4">{accionError}</p>
          )}

          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

          {/* LOADING */}
          {loading && (
            <p className="text-sm text-gray-500 mt-4">Cargando reservas...</p>
          )}

          {/* TABLA */}
          {!loading && reservas.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">
                  Listado de reservas
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Espacio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Horario
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {reservas.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {r.usuario.nombre} {r.usuario.apellido}
                        </td>

                        <td className="px-6 py-4 text-gray-800">
                          {r.espacio.nombre}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                            {r.estado}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {formatHora(r.horaInicio)}
                            </span>
                            <span className="text-gray-400">—</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {formatHora(r.horaFin)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
