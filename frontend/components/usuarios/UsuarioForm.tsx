"use client";
import { useState } from "react";
import type { Usuario } from "@/interfaces/usuario.interface";
import type { CreateUsuarioDto, UpdateUsuarioDto } from "@/services/usuarios.service";

interface Props {
  inicial?: Usuario | null;
  // ✅ En creación enviamos CreateUsuarioDto; en edición enviamos UpdateUsuarioDto (sin contraseña si no se cambia)
  onSubmit: (data: CreateUsuarioDto | UpdateUsuarioDto) => void;
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
          contrasena: "", // en edición queda vacío para NO cambiarla
          telefono: inicial.telefono ?? "",
          membresiaId: inicial.membresiaId,
        }
      : vacio
  );

  const [error, setError] = useState<string | null>(null);

  // ✅ Teléfono: 10 dígitos, empieza por 3
  const esTelefonoValido = (tel: string) => /^3\d{9}$/.test(tel);

  // ✅ Contraseña: 8-32, 1 mayúscula, 1 minúscula, 1 número, sin espacios
  const esContrasenaValida = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,32}$/.test(pwd);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // ✅ Teléfono: solo dígitos, máximo 10
    if (name === "telefono") {
      const soloDigitos = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, telefono: soloDigitos }));
      setError(null);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "membresiaId" ? Number(value) : value,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const esEdicion = !!inicial;

    // ✅ Validación de teléfono (obligatorio)
    if (!form.telefono) {
      setError("El teléfono es obligatorio.");
      return;
    }
    if (!esTelefonoValido(form.telefono)) {
      setError("El teléfono debe tener 10 dígitos, solo números y empezar por 3 (ej: 3001234567).");
      return;
    }

    // ✅ Validación de contraseña:
    // - Creación: obligatoria y debe cumplir
    // - Edición: opcional; si viene vacía, no se envía; si viene con valor, debe cumplir
    if (!esEdicion) {
      if (!form.contrasena) {
        setError("La contraseña es obligatoria.");
        return;
      }
      if (!esContrasenaValida(form.contrasena)) {
        setError("La contraseña debe tener 8 a 32 caracteres, incluir 1 mayúscula, 1 minúscula y 1 número (sin espacios).");
        return;
      }
      onSubmit(form);
      return;
    }

    // ✅ Edición: enviar DTO parcial, y NO enviar contrasena si está vacía
    const payload: UpdateUsuarioDto = {
      nombre: form.nombre,
      apellido: form.apellido,
      correo: form.correo,
      telefono: form.telefono,
      membresiaId: form.membresiaId,
    };

    if (form.contrasena) {
      if (!esContrasenaValida(form.contrasena)) {
        setError("La contraseña debe tener 8 a 32 caracteres, incluir 1 mayúscula, 1 minúscula y 1 número (sin espacios).");
        return;
      }
      payload.contrasena = form.contrasena;
    }

    onSubmit(payload);
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
        {...(name === "telefono"
          ? {
              inputMode: "numeric" as const,
              maxLength: 10,
              placeholder: "Ej: 3001234567",
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (["e", "E", "+", "-", ".", ",", " "].includes(e.key)) e.preventDefault();
              },
            }
          : {})}
      />

      {name === "telefono" && (
        <p className="text-xs text-gray-400">
          Obligatorio. 10 dígitos. Solo números. Debe empezar por 3.
        </p>
      )}

      {name === "contrasena" && (
        <p className="text-xs text-gray-400">
          {inicial
            ? "Opcional: déjala vacía para no cambiarla. Si la cambias: 8–32, 1 mayúscula, 1 minúscula, 1 número."
            : "Obligatoria: 8–32, 1 mayúscula, 1 minúscula, 1 número (sin espacios)."}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {campo("Nombre", "nombre")}
      {campo("Apellido", "apellido")}
      {campo("Correo", "correo", "email")}
      {/* ✅ Creación: required. Edición: opcional */}
      {campo("Contraseña", "contrasena", "password", !inicial)}
      {campo("Teléfono", "telefono", "text", true)}

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

      {error && (
        <div className="md:col-span-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <div className="md:col-span-2 flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {cargando ? "Guardando..." : inicial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}