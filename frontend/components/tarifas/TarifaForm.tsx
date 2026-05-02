"use client";

import { useEffect, useState } from "react";
import type { TarifaConRelaciones } from "@/services/tarifas.service";
import type { CreateTarifaDto } from "@/services/tarifas.service";
import { tiposEspacioService } from "@/services/tipos-espacio.service";
import { membresiasService } from "@/services/membresias.service";
import type { TipoEspacio } from "@/interfaces/tipo-espacio.interface";
import type { Membresia } from "@/interfaces/membresia.interface";

interface Props {
  inicial?: TarifaConRelaciones | null;
  onSubmit: (data: CreateTarifaDto) => void;
  onCancel: () => void;
  cargando: boolean;
}

type FormState = {
  precioHora: string;
  tipoEspacioId: number;
  membresiaId: number;
};

const vacio: FormState = {
  precioHora: "",
  tipoEspacioId: 0,
  membresiaId: 0,
};

export default function TarifaForm({ inicial, onSubmit, onCancel, cargando }: Props) {
  const [tipos, setTipos] = useState<TipoEspacio[]>([]);
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [form, setForm] = useState<FormState>(
    inicial
      ? {
          precioHora: String(inicial.precioHora),
          tipoEspacioId: inicial.tipoEspacioId,
          membresiaId: inicial.membresiaId,
        }
      : vacio,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tiposEspacioService.findAll().then(setTipos).catch(() => setTipos([]));
    membresiasService.findAll().then(setMembresias).catch(() => setMembresias([]));
  }, []);

  const sinTipos = tipos.length === 0;
  const sinMembresias = membresias.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const precio = Number(form.precioHora);
    if (!form.precioHora || Number.isNaN(precio) || precio <= 0) {
      setError("El precio por hora debe ser un número mayor a 0.");
      return;
    }

    if (!form.tipoEspacioId) {
      setError("Debe seleccionar un tipo de espacio.");
      return;
    }

    if (!form.membresiaId) {
      setError("Debe seleccionar una membresía.");
      return;
    }

    if (!inicial && (sinTipos || sinMembresias)) {
      setError("Faltan datos base. Primero crea tipos de espacio y membresías.");
      return;
    }

    onSubmit({
      precioHora: precio,
      tipoEspacioId: form.tipoEspacioId,
      membresiaId: form.membresiaId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-sm font-medium text-gray-700">Precio por hora</label>
        <input
          type="text"
          inputMode="decimal"
          value={form.precioHora}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
            setForm((prev) => ({ ...prev, precioHora: value }));
            setError(null);
          }}
          placeholder="Ej: 15000"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tipo de espacio</label>
        <select
          value={form.tipoEspacioId}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, tipoEspacioId: Number(e.target.value) }));
            setError(null);
          }}
          disabled={sinTipos}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value={0}>{sinTipos ? "No hay tipos disponibles" : "Seleccione tipo"}</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Membresía</label>
        <select
          value={form.membresiaId}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, membresiaId: Number(e.target.value) }));
            setError(null);
          }}
          disabled={sinMembresias}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option value={0}>{sinMembresias ? "No hay membresías disponibles" : "Seleccione membresía"}</option>
          {membresias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.tipo}
            </option>
          ))}
        </select>
      </div>

      {(sinTipos || sinMembresias) && !inicial && (
        <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Prerequisito: crea primero tipos de espacio y membresías para poder registrar tarifas.
        </div>
      )}

      {error && (
        <div className="md:col-span-2 text-red-500 text-sm">{error}</div>
      )}

      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando || (!inicial && (sinTipos || sinMembresias))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {cargando ? "Guardando..." : inicial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}