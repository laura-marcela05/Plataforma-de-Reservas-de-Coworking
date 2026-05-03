"use client";

import { useEffect, useState } from "react";

import {
  tiposEspacioService,
  type CreateTipoEspacioDto,
} from "@/services/tipos-espacio.service";

import type { TipoEspacio } from "@/interfaces/tipo-espacio.interface";

import TipoEspacioForm from "@/components/tipos-espacio/TipoEspacioForm";
import TiposEspacioTable from "@/components/tipos-espacio/TiposEspacioTable";

export default function TiposEspacioPage() {
  const [tipos, setTipos] = useState<TipoEspacio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI CRUD
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<TipoEspacio | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [accionError, setAccionError] = useState<string | null>(null);

  // =========================
  // Helper de error seguro
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

      const data = await tiposEspacioService.findAll();
      setTipos(data);
    } catch {
      setError("Error al cargar tipos de espacio.");
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
  const handleSubmit = async (data: CreateTipoEspacioDto) => {
    try {
      setGuardando(true);
      setAccionError(null);

      if (editando) {
        await tiposEspacioService.update(editando.id, data);
      } else {
        await tiposEspacioService.create(data);
      }

      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch (e: unknown) {
      setAccionError(
        getErrorMessage(e) || "Error al guardar el tipo de espacio.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (t: TipoEspacio) => {
    setEditando(t);
    setMostrarForm(true);
    setAccionError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este tipo de espacio?")) return;

    try {
      setAccionError(null);
      await tiposEspacioService.remove(id);
      await cargar();
    } catch (e: unknown) {
      setAccionError(
        getErrorMessage(e) ||
          "No se puede eliminar. Este tipo puede estar asociado a espacios.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          CARD: TIPOS DE ESPACIO
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
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tipos de espacio
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Configura categorías de espacios (oficina, sala, etc.)
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
              {mostrarForm ? "Cancelar" : "＋ Nuevo tipo"}
            </button>
          </div>

          {/* ERROR GLOBAL */}
          {accionError && (
            <p className="text-red-500 mt-4 text-sm">{accionError}</p>
          )}

          {/* FORMULARIO */}
          {mostrarForm && (
            <div className="mt-4">
              <TipoEspacioForm
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
              <TiposEspacioTable
                tipos={tipos}
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
