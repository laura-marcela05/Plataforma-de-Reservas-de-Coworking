"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  reservasService,
  type ReservaHistorial,
} from "@/services/reservas.service";

const formatFecha = (value: string) =>
  new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const formatHora = (value: string) => {
  const direct = value.match(/T(\d{2}:\d{2})/);
  if (direct) return direct[1];
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
};

const ESTADO_STYLE: Record<string, string> = {
  activa: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  cancelada: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  finalizada: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

const resumenInicial = {
  total: 0,
  activas: 0,
  canceladas: 0,
};

export default function HistorialReservasPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando historial...</div>}>
      <HistorialReservasContent />
    </Suspense>
  );
}

function HistorialReservasContent() {
  const searchParams = useSearchParams();
  const usuarioParam = searchParams.get("usuarioId") ?? "";

  const [usuarioId, setUsuarioId] = useState(usuarioParam);
  const [historial, setHistorial] = useState<ReservaHistorial[]>([]);
  const [cargando, setCargando] = useState(false);
  const [consultado, setConsultado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (usuarioParam) {
      setUsuarioId(usuarioParam);
      void consultarHistorial(Number(usuarioParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioParam]);

  const consultarHistorial = async (id?: number) => {
    const usuarioNum = id ?? Number(usuarioId);

    if (!usuarioNum || Number.isNaN(usuarioNum) || usuarioNum <= 0) {
      setError("Ingresa un ID de usuario válido.");
      setHistorial([]);
      setConsultado(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);
      setConsultado(true);
      const data = await reservasService.findHistorial(usuarioNum);
      setHistorial(data);
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "No fue posible consultar el historial.";
      setError(message);
      setHistorial([]);
    } finally {
      setCargando(false);
    }
  };

  const resumen = useMemo(() => {
    return historial.reduce(
      (acc, reserva) => ({
        total: acc.total + 1,
        activas: acc.activas + (reserva.estado === "activa" ? 1 : 0),
        canceladas: acc.canceladas + (reserva.estado === "cancelada" ? 1 : 0),
      }),
      resumenInicial,
    );
  }, [historial]);

  const usuario = historial[0]?.usuario;

  return (
    <div className="space-y-6">
      {/* =========================
        CARD: HISTORIAL
       ========================= */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* HEADER CON ICONO */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
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
                  Historial de reservas
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Consulta todas las reservas de un usuario
                </p>
              </div>
            </div>

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
                  ID Usuario
                </label>

                <input
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  className="mt-1 block border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 1"
                />
              </div>

              <button
                onClick={() => void consultarHistorial()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Consultar
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* LOADING */}
          {cargando && (
            <p className="text-sm text-gray-500 mt-4">Cargando historial...</p>
          )}

          {/* TABLA */}
          {!cargando && historial.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Espacio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {historial.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{formatFecha(r.fecha)}</td>

                      <td className="px-6 py-4">
                        {formatHora(r.horaInicio)} — {formatHora(r.horaFin)}
                      </td>

                      <td className="px-6 py-4">
                        {r.espacio?.nombre ?? `Espacio #${r.espacioId}`}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            ESTADO_STYLE[r.estado] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!cargando && consultado && historial.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">
              No hay reservas registradas para este usuario
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
