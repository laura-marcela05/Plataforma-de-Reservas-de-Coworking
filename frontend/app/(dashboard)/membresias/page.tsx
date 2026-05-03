"use client";

import { useEffect, useState } from "react";

import {
  membresiasService,
  type CreateMembresiaDto,
} from "@/services/membresias.service";

import type { Membresia } from "@/interfaces/membresia.interface";

import MembresiaForm from "@/components/membresias/MembresiaForm";
import MembresiasTable from "@/components/membresias/MembresiasTable";

export default function MembresiasPage() {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI CRUD
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Membresia | null>(null);
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

      const data = await membresiasService.findAll();
      setMembresias(data);
    } catch {
      setError("Error al cargar membresías.");
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
  const handleSubmit = async (data: CreateMembresiaDto) => {
    try {
      setGuardando(true);
      setAccionError(null);

      if (editando) {
        await membresiasService.update(editando.id, data);
      } else {
        await membresiasService.create(data);
      }

      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch (e: unknown) {
      setAccionError(getErrorMessage(e) || "Error al guardar la membresía.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (m: Membresia) => {
    setEditando(m);
    setMostrarForm(true);
    setAccionError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta membresía?")) return;

    try {
      setAccionError(null);
      await membresiasService.remove(id);
      await cargar();
    } catch (e: unknown) {
      setAccionError(
        getErrorMessage(e) ||
          "No se puede eliminar. Esta membresía puede tener usuarios asociados.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================
          CARD: GESTIÓN DE MEMBRESÍAS
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
                  <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-3.5L6 21l1.5-7.5L2 9h7l3-7z" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gestión de membresías
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Administra planes de acceso y beneficios
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
              {mostrarForm ? "Cancelar" : "＋ Nueva membresía"}
            </button>
          </div>

          {/* ERROR GLOBAL */}
          {accionError && (
            <p className="text-red-500 mt-4 text-sm">{accionError}</p>
          )}

          {/* FORM */}
          {mostrarForm && (
            <div className="mt-4">
              <MembresiaForm
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
              <MembresiasTable
                membresias={membresias}
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
