"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { sedesService, type CreateSedeDto } from "@/services/sedes.service";

import type { Sede } from "@/interfaces/sede.interface";

import SedesTable from "@/components/sedes/SedesTable";
import SedeForm from "@/components/sedes/SedeForm";

export default function SedesPage() {
  const router = useRouter();

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI CRUD
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Sede | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [accionError, setAccionError] = useState<string | null>(null);

  // Buscador
  const [buscarId, setBuscarId] = useState("");
  const [buscarError, setBuscarError] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  // =========================
  // Helper seguro de errores
  // =========================
  const getErrorMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return null;
  };

  const cargar = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await sedesService.findAll();
      setSedes(data);
    } catch {
      setError("Error al cargar sedes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // =========================
  // CRUD
  // =========================
  const handleSubmit = async (data: CreateSedeDto) => {
    try {
      setGuardando(true);
      setAccionError(null);

      if (editando) {
        await sedesService.update(editando.id, data);
      } else {
        await sedesService.create(data);
      }

      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch (e: unknown) {
      setAccionError(getErrorMessage(e) || "Error al guardar la sede.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (s: Sede) => {
    setEditando(s);
    setMostrarForm(true);
    setAccionError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta sede?")) return;

    try {
      setAccionError(null);
      await sedesService.remove(id);
      await cargar();
    } catch (e: unknown) {
      setAccionError(
        getErrorMessage(e) ||
          "No se puede eliminar. La sede puede tener espacios asociados.",
      );
    }
  };

  // =========================
  // BUSCADOR
  // =========================
  const ejecutarBusqueda = async () => {
    setBuscarError(null);

    const idNum = Number(buscarId);
    if (!buscarId || Number.isNaN(idNum) || idNum <= 0) {
      setBuscarError("ID inválido");
      return;
    }

    try {
      setBuscando(true);
      await sedesService.findOne(idNum);
      router.push(`/sedes/${idNum}`);
    } catch (e: unknown) {
      setBuscarError(getErrorMessage(e) || "ID inexistente");
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          CARD: GESTIÓN DE SEDES
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
                  <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gestión de sedes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Administra las ubicaciones del sistema
                </p>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* BUSCADOR */}
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <input
                    value={buscarId}
                    onChange={(e) => {
                      const soloNumeros = e.target.value.replace(/\D/g, "");
                      setBuscarId(soloNumeros);
                      setBuscarError(null);
                    }}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", ".", ","].includes(e.key))
                        e.preventDefault();
                      if (e.key === "Enter") ejecutarBusqueda();
                    }}
                    inputMode="numeric"
                    placeholder="Buscar ID"
                    className="px-3 py-2 border border-gray-300 rounded-l-lg text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={buscando}
                  />

                  <button
                    type="button"
                    onClick={ejecutarBusqueda}
                    disabled={buscando}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                    title="Buscar"
                  >
                    🔍
                  </button>
                </div>

                {buscarError && (
                  <p className="text-red-500 text-xs mt-1">{buscarError}</p>
                )}
              </div>

              {/* BOTÓN NUEVO */}
              <button
                onClick={() => {
                  setEditando(null);
                  setMostrarForm((v) => !v);
                  setAccionError(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-sm transition"
              >
                {mostrarForm ? "Cancelar" : "＋ Nueva sede"}
              </button>
            </div>
          </div>

          {/* ERROR GLOBAL */}
          {accionError && (
            <p className="text-red-500 mt-4 text-sm">{accionError}</p>
          )}

          {/* FORM */}
          {mostrarForm && (
            <div className="mt-4">
              <SedeForm
                inicial={editando}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setMostrarForm(false);
                  setEditando(null);
                  setAccionError(null);
                }}
                cargando={guardando}
              />
            </div>
          )}

          {/* LISTADO */}
          <div className="mt-4">
            {cargando && <p className="text-gray-500">Cargando...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {!cargando && !error && (
              <SedesTable
                sedes={sedes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
