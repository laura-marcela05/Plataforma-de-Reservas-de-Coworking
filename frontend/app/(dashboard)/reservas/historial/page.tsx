"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { reservasService, type ReservaHistorial } from "@/services/reservas.service";

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
      const message = e instanceof Error ? e.message : "No fue posible consultar el historial.";
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Historial de Reservas</h1>

        <Link
          href="/reservas"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver a reservas
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <label className="text-sm font-medium text-gray-700 md:mr-3">
              ID del usuario
            </label>
            <input
              value={usuarioId}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setUsuarioId(onlyDigits);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void consultarHistorial();
                if (["e", "E", "+", "-", ",", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              inputMode="numeric"
              placeholder="Ej: 12"
              className="rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 md:max-w-64"
            />
          </div>

          <button
            type="button"
            onClick={() => void consultarHistorial()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {cargando ? "Consultando..." : "Consultar historial"}
          </button>
        </div>
      </div>

      {(error || (consultado && historial.length === 0)) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            {error ? "No se pudo consultar" : "Sin reservas registradas"}
          </h2>
          <p className="mt-1 text-sm text-red-700">
            {error ?? "Este usuario todavía no tiene reservas en el sistema."}
          </p>
        </div>
      )}

      {historial.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Total</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{resumen.total}</p>
              <p className="mt-1 text-sm text-gray-600">Reservas encontradas</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Activas</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{resumen.activas}</p>
              <p className="mt-1 text-sm text-gray-600">Reservas vigentes</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Canceladas</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{resumen.canceladas}</p>
              <p className="mt-1 text-sm text-gray-600">Reservas anuladas</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {usuario
                  ? `${usuario.nombre} ${usuario.apellido}`
                  : `Usuario #${usuarioId}`}
              </h2>
              {usuario && (
                <p className="text-sm text-gray-600">{usuario.correo}</p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-t border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Horario</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Espacio</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Sede</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historial.map((reserva) => (
                    <tr key={reserva.id} className="hover:shadow-sm hover:bg-gray-50 transition">
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-semibold text-gray-900">{formatFecha(reserva.fecha)}</div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="inline-flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {formatHora(reserva.horaInicio)}
                          </span>
                          <span className="text-sm text-gray-500">—</span>
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {formatHora(reserva.horaFin)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-semibold text-gray-900">{reserva.espacio?.nombre ?? `Espacio #${reserva.espacioId}`}</div>
                        <div className="text-xs text-gray-500 mt-1">{reserva.espacio?.descripcion ?? reserva.espacio?.tipoEspacio?.nombre ?? "Descripción no disponible"}</div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="text-sm text-gray-700">{reserva.espacio?.sede?.nombre ?? "Sin sede"}</div>
                        <div className="text-xs text-gray-500 mt-1">{reserva.espacio?.sede?.direccion ?? "-"}</div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ESTADO_STYLE[reserva.estado] ?? "bg-gray-100 text-gray-600"}`}>
                          {reserva.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}