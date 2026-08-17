"use client";

import { useState } from "react";
import CaisseForm from "./CaisseForm";
import { deleteMouvement } from "@/lib/caisse/queries";
import type { Caisse } from "@/types/database";

type CaisseListProps = {
  mouvements: Caisse[];
};

export default function CaisseList({ mouvements }: CaisseListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce mouvement ?")) return;

    setDeletingId(id);
    await deleteMouvement(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Caisse</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouveau mouvement"}
        </button>
      </div>

      {showCreateForm && (
        <CaisseForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {mouvements.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun mouvement de caisse enregistré.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Type</th>
              <th className="py-2">Montant</th>
              <th className="py-2">Motif</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {mouvements.map((mouvement) =>
              editingId === mouvement.id ? (
                <tr key={mouvement.id}>
                  <td colSpan={5} className="py-2">
                    <CaisseForm
                      mouvement={mouvement}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={mouvement.id} className="border-b">
                  <td className="py-2">{mouvement.date_mouvement.slice(0, 10)}</td>
                  <td className="py-2">
                    {mouvement.type_mouvement === "entree" ? "Entrée" : "Sortie"}
                  </td>
                  <td
                    className={`py-2 ${
                      mouvement.type_mouvement === "entree"
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {mouvement.type_mouvement === "entree" ? "+" : "-"}
                    {mouvement.montant.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-2">{mouvement.motif ?? "—"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(mouvement.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(mouvement.id)}
                        disabled={deletingId === mouvement.id}
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
