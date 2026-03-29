"use client";
import { useEffect, useState } from "react";
import { sedesService, type CreateSedeDto } from "@/services/sedes.service";
import type { Sede } from "@/interfaces/sede.interface";
import SedesTable from "@/components/sedes/SedesTable";
import SedeForm from "@/components/sedes/SedeForm";

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Sede | null>(null);
  const [guardando, setGuardando] = useState(false);

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

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (data: CreateSedeDto) => {
    try {
      setGuardando(true);
      if (editando) {
        await sedesService.update(editando.id, data);
      } else {
        await sedesService.create(data);
      }
      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch {
      alert("Error al guardar la sede.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta sede?")) return;
    try {
      await sedesService.remove(id);
      await cargar();
    } catch {
      alert("No se puede eliminar. La sede puede tener espacios asociados.");
    }
  };

  const handleEdit = (s: Sede) => {
    setEditando(s);
    setMostrarForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sedes</h1>
        <button
          onClick={() => { setEditando(null); setMostrarForm(!mostrarForm); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {mostrarForm ? "Cancelar" : "Nueva sede"}
        </button>
      </div>

      {mostrarForm && (
        <SedeForm
          inicial={editando}
          onSubmit={handleSubmit}
          onCancel={() => { setMostrarForm(false); setEditando(null); }}
          cargando={guardando}
        />
      )}

      {cargando && <p className="text-gray-500 mt-4">Cargando...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!cargando && !error && (
        <SedesTable sedes={sedes} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}