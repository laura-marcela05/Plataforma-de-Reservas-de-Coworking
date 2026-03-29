"use client";
import { useState } from "react";
import type { Sede } from "@/interfaces/sede.interface";
import type { CreateSedeDto } from "@/services/sedes.service";

interface Props {
  inicial?: Sede | null;
  onSubmit: (data: CreateSedeDto) => void;
  onCancel: () => void;
  cargando: boolean;
}

const vacio: CreateSedeDto = {
  nombre: "",
  direccion: "",
  horarioApertura: "",
  horarioCierre: "",
  capacidadTotal: 1,
};

export default function SedeForm({ inicial, onSubmit, onCancel, cargando }: Props) {
  const [form, setForm] = useState<CreateSedeDto>(
    inicial
      ? {
          nombre: inicial.nombre,
          direccion: inicial.direccion,
          horarioApertura: inicial.horarioApertura,
          horarioCierre: inicial.horarioCierre,
          capacidadTotal: inicial.capacidadTotal,
        }
      : vacio
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "capacidadTotal" ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const campo = (label: string, name: keyof CreateSedeDto, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] as string | number}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {campo("Nombre", "nombre")}
      {campo("Dirección", "direccion")}
      {campo("Horario apertura (ej: 08:00)", "horarioApertura")}
      {campo("Horario cierre (ej: 20:00)", "horarioCierre")}
      {campo("Capacidad total", "capacidadTotal", "number")}

      <div className="md:col-span-2 flex gap-3 justify-end mt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
          Cancelar
        </button>
        <button type="submit" disabled={cargando} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
          {cargando ? "Guardando..." : inicial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}