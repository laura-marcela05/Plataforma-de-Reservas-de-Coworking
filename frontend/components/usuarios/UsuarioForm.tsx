"use client";
import { useState } from "react";
import type { Usuario } from "@/interfaces/usuario.interface";
import type { CreateUsuarioDto } from "@/services/usuarios.service";

interface Props {
  inicial?: Usuario | null;
  onSubmit: (data: CreateUsuarioDto) => void;
  onCancel: () => void;
  cargando: boolean;
}

const vacio: CreateUsuarioDto = {
  nombre: "",
  apellido: "",
  correo: "",
  contrasena: "",
  telefono: "",
  membresiaId: 2,
};

export default function UsuarioForm({ inicial, onSubmit, onCancel, cargando }: Props) {
  const [form, setForm] = useState<CreateUsuarioDto>(
    inicial
      ? {
          nombre: inicial.nombre,
          apellido: inicial.apellido,
          correo: inicial.correo,
          contrasena: "",
          telefono: inicial.telefono ?? "",
          membresiaId: inicial.membresiaId,
        }
      : vacio
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "membresiaId" ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const campo = (label: string, name: keyof CreateUsuarioDto, type = "text", required = true) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] as string}
        onChange={handleChange}
        required={required}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {campo("Nombre", "nombre")}
      {campo("Apellido", "apellido")}
      {campo("Correo", "correo", "email")}
      {campo("Contraseña", "contrasena", "password")}
      {campo("Teléfono", "telefono", "text", false)}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Membresía</label>
        <select
          name="membresiaId"
          value={form.membresiaId}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value={2}>Básica</option>
          <option value={3}>Premium</option>
          <option value={4}>Corporativa</option>
        </select>
      </div>

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