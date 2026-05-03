"use client";

import { useEffect, useState } from "react";

import {
  tarifasService,
  type CreateTarifaDto,
  type TarifaConRelaciones,
} from "@/services/tarifas.service";

import TarifaForm from "@/components/tarifas/TarifaForm";
import TarifasTable from "@/components/tarifas/TarifasTable";

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState<TarifaConRelaciones[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI CRUD
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<TarifaConRelaciones | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [accionError, setAccionError] = useState<string | null>(null);

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

      const data = await tarifasService.findAll();
      setTarifas(data);
    } catch {
      setError("Error al cargar tarifas.");
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
  const handleSubmit = async (data: CreateTarifaDto) => {
    try {
      setGuardando(true);
      setAccionError(null);

      if (editando) {
        await tarifasService.update(editando.id, data);
      } else {
        await tarifasService.create(data);
      }

      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch (e: unknown) {
      setAccionError(getErrorMessage(e) || "Error al guardar la tarifa.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (t: TarifaConRelaciones) => {
    setEditando(t);
    setMostrarForm(true);
    setAccionError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tarifa?")) return;

    try {
      setAccionError(null);
      await tarifasService.remove(id);
      await cargar();
    } catch (e: unknown) {
      setAccionError(getErrorMessage(e) || "No se pudo eliminar la tarifa.");
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          CARD: GESTIÓN DE TARIFAS
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
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gestión de tarifas
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Administra precios por tipo de espacio y sede
                </p>
              </div>
            </div>

            {/* ACCIÓN PRINCIPAL */}
            <button
              onClick={() => {
                setEditando(null);
                setMostrarForm((v) => !v);
                setAccionError(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-sm transition"
            >
              {mostrarForm ? "Cancelar" : "＋ Nueva tarifa"}
            </button>
          </div>

          {/* ERROR GLOBAL */}
          {accionError && (
            <p className="text-red-500 mt-4 text-sm">{accionError}</p>
          )}

          {/* FORMULARIO */}
          {mostrarForm && (
            <div className="mt-4">
              <TarifaForm
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
              <TarifasTable
                tarifas={tarifas}
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
