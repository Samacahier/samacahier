"use client";

import { useState } from "react";
import DepenseForm from "./DepenseForm";
import { deleteDepense } from "@/lib/depenses/queries";
import type { Depense } from "@/types/database";

type DepenseListProps = {
  depenses: Depense[];
};

export default function DepenseList({ depenses }: DepenseListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette dépense ?")) return;

    setDeletingId(id);
    await deleteDepense(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dépenses</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouvelle dépense"}
        </button>
      </div>

      {showCreateForm && (
        <DepenseForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {depenses.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucune dépense enregistrée.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Libellé</th>
              <th className="py-2">Catégorie</th>
              <th className="py-2">Montant</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {depenses.map((depense) =>
              editingId === depense.id ? (
                <tr key={depense.id}>
                  <td colSpan={5} className="py-2">
                    <DepenseForm
                      depense={depense}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={depense.id} className="border-b">
                  <td className="py-2">{depense.date_depense}</td>
                  <td className="py-2">{depense.libelle}</td>
                  <td className="py-2">{depense.categorie ?? "—"}</td>
                  <td className="py-2">{depense.montant.toLocaleString("fr-FR")}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(depense.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(depense.id)}
                        disabled={deletingId === depense.id}
                        className="text-red-600 underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
