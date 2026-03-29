"use client";
import { useEffect, useState } from "react";
import { usuariosService, type CreateUsuarioDto } from "@/services/usuarios.service";
import type { Usuario } from "@/interfaces/usuario.interface";
import UsuariosTable from "@/components/usuarios/UsuariosTable";
import UsuarioForm from "@/components/usuarios/UsuarioForm";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await usuariosService.findAll();
      setUsuarios(data);
    } catch {
      setError("Error al cargar usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (data: CreateUsuarioDto) => {
    try {
      setGuardando(true);
      if (editando) {
        await usuariosService.update(editando.id, data);
      } else {
        await usuariosService.create(data);
      }
      setMostrarForm(false);
      setEditando(null);
      await cargar();
    } catch {
      alert("Error al guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await usuariosService.remove(id);
      await cargar();
    } catch {
      alert("No se puede eliminar. El usuario puede tener reservas asociadas.");
    }
  };

  const handleEdit = (u: Usuario) => {
    setEditando(u);
    setMostrarForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          onClick={() => { setEditando(null); setMostrarForm(!mostrarForm); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {mostrarForm ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {mostrarForm && (
        <UsuarioForm
          inicial={editando}
          onSubmit={handleSubmit}
          onCancel={() => { setMostrarForm(false); setEditando(null); }}
          cargando={guardando}
        />
      )}

      {cargando && <p className="text-gray-500 mt-4">Cargando...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!cargando && !error && (
        <UsuariosTable usuarios={usuarios} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}