"use client";

import type { TarifaConRelaciones } from "@/services/tarifas.service";

interface Props {
  tarifas: TarifaConRelaciones[];
  onEdit: (t: TarifaConRelaciones) => void;
  onDelete: (id: number) => void;
}

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function TarifasTable({ tarifas, onEdit, onDelete }: Props) {
  if (tarifas.length === 0) {
    return <p className="text-gray-500 mt-4">No hay tarifas registradas.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-xl text-sm bg-white">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Tipo de espacio</th>
            <th className="px-4 py-3 text-left">Membresía</th>
            <th className="px-4 py-3 text-left">Precio/hora</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tarifas.map((t) => (
            <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">{t.id}</td>
              <td className="px-4 py-3 font-medium">{t.tipoEspacio?.nombre ?? `Tipo #${t.tipoEspacioId}`}</td>
              <td className="px-4 py-3">{t.membresia?.tipo ?? `Membresía #${t.membresiaId}`}</td>
              <td className="px-4 py-3 text-slate-700">{moneda.format(t.precioHora)}</td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}