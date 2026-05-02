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
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<TarifaConRelaciones | null>(null);
  const [guardando, setGuardando] = useState(false);

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

  const handleSubmit = async (data: CreateTarifaDto) => {
    try {
      setGuardando(true);
      if (editando) {
        await tarifasService.update(editando.id, data);
      } else {
        await tarifasService.create(data);
      }
      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error al guardar la tarifa.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tarifa?")) return;

    try {
      await tarifasService.remove(id);
      await cargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "No se pudo eliminar la tarifa.");
    }
  };

  const handleEdit = (t: TarifaConRelaciones) => {
    setEditando(t);
    setMostrarForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tarifas</h1>

        <button
          onClick={() => {
            setEditando(null);
            setMostrarForm((v) => !v);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {mostrarForm ? "Cancelar" : "Nueva tarifa"}
        </button>
      </div>

      {mostrarForm && (
        <TarifaForm
          inicial={editando}
          onSubmit={handleSubmit}
          onCancel={() => {
            setMostrarForm(false);
            setEditando(null);
          }}
          cargando={guardando}
        />
      )}

      {cargando && <p className="text-gray-500 mt-4">Cargando...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!cargando && !error && (
        <TarifasTable tarifas={tarifas} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
