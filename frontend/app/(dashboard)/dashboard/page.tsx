"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reservasService } from "@/services/reservas.service";
import { usuariosService } from "@/services/usuarios.service";
import { espaciosService } from "@/services/espacios.service";

// ─── ICONOS ───────────────────────────────────────────────────────

const IconUsers = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconEspacio = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 21V9h6v12" />
  </svg>
);

const IconCalendar = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconActive = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
  </svg>
);

// ─── TIPOS ────────────────────────────────────────────────────────

interface ReservaItem {
  id: number;
  usuarioId: number;
  espacioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export default function DashboardPage() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalEspacios, setTotalEspacios] = useState(0);
  const [reservasHoy, setReservasHoy] = useState(0);
  const [reservasActivas, setReservasActivas] = useState(0);
  const [ultimasReservas, setUltimasReservas] = useState<ReservaItem[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [usuarios, espacios, reservas] = await Promise.all([
          usuariosService.findAll(),
          espaciosService.findAll(),
          reservasService.findAll(),
        ]);

        setTotalUsuarios(usuarios.length);
        setTotalEspacios(espacios.length);

        const hoy = new Date().toISOString().split("T")[0];
        const reservasDeHoy = reservas.filter(
          (r) => r.fecha.split("T")[0] === hoy,
        );

        setReservasHoy(reservasDeHoy.length);
        setReservasActivas(
          reservas.filter((r) => r.estado === "activa").length,
        );

        // Tomamos las últimas 5 reservas ordenadas por ID descendente
        const ultimas = [...reservas].sort((a, b) => b.id - a.id).slice(0, 5);
        setUltimasReservas(ultimas);
      } catch {
        console.error("Error cargando dashboard");
      }
    };

    cargarDatos();
  }, []);

  const ESTADO_BADGE: Record<string, string> = {
    activa: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
    finalizada: "bg-gray-100 text-gray-600",
  };

  const formatHora = (hora: string): string => {
    const direct = hora.match(/T(\d{2}:\d{2})/);
    if (direct) return direct[1];
    if (/^\d{2}:\d{2}/.test(hora)) return hora.slice(0, 5);
    return hora;
  };

  const Card = ({
    title,
    value,
    description,
    icon,
    color,
  }: {
    title: string;
    value: number;
    description: string;
    icon: JSX.Element;
    color: string;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen operativo de la plataforma de coworking
        </p>
      </div>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          title="Usuarios"
          value={totalUsuarios}
          description="Registrados en la plataforma"
          icon={<IconUsers />}
          color="bg-blue-600"
        />
        <Card
          title="Espacios"
          value={totalEspacios}
          description="Disponibles para reserva"
          icon={<IconEspacio />}
          color="bg-purple-600"
        />
        <Card
          title="Reservas hoy"
          value={reservasHoy}
          description="Programadas para hoy"
          icon={<IconCalendar />}
          color="bg-orange-500"
        />
        <Card
          title="Reservas activas"
          value={reservasActivas}
          description="En curso actualmente"
          icon={<IconActive />}
          color="bg-green-600"
        />
      </div>

      {/* ACCESOS RÁPIDOS */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/reservas"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition text-center"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconCalendar />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Nueva reserva
              </span>
            </Link>

            <Link
              href="/usuarios"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition text-center"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <IconUsers />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Usuarios
              </span>
            </Link>

            <Link
              href="/espacios"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition text-center"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <IconEspacio />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Espacios
              </span>
            </Link>

            <Link
              href="/reservas/activas"
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition text-center"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <IconActive />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Activas del día
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ÚLTIMAS RESERVAS */}
      {ultimasReservas.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Últimas reservas
              </h2>
              <Link
                href="/reservas"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver todas →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 text-gray-600">ID</th>
                    <th className="text-left p-3 text-gray-600">Usuario</th>
                    <th className="text-left p-3 text-gray-600">Espacio</th>
                    <th className="text-left p-3 text-gray-600">Fecha</th>
                    <th className="text-left p-3 text-gray-600">Horario</th>
                    <th className="text-left p-3 text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasReservas.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3">{r.id}</td>
                      <td className="p-3">{r.usuarioId}</td>
                      <td className="p-3">{r.espacioId}</td>
                      <td className="p-3">
                        {new Date(r.fecha).toLocaleDateString("es-CO")}
                      </td>
                      <td className="p-3">
                        {formatHora(r.horaInicio)} — {formatHora(r.horaFin)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_BADGE[r.estado] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {r.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
