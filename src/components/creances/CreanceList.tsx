"use client";

import { useState } from "react";
import CreanceForm from "./CreanceForm";
import { deleteCreance } from "@/lib/creances/queries";
import type { Creance } from "@/types/database";

type CreanceListProps = {
  creances: Creance[];
};

const STATUT_LABELS: Record<Creance["statut"], string> = {
  en_cours: "En cours",
  soldee: "Soldée",
  en_retard: "En retard",
};

export default function CreanceList({ creances }: CreanceListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette créance ?")) return;

    setDeletingId(id);
    await deleteCreance(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Créances</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouvelle créance"}
        </button>
      </div>

      {showCreateForm && (
        <CreanceForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {creances.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucune créance enregistrée.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Client</th>
              <th className="py-2">Dû</th>
              <th className="py-2">Remboursé</th>
              <th className="py-2">Statut</th>
              <th className="py-2">Échéance</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {creances.map((creance) =>
              editingId === creance.id ? (
                <tr key={creance.id}>
                  <td colSpan={6} className="py-2">
                    <CreanceForm
                      creance={creance}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={creance.id} className="border-b">
                  <td className="py-2">{creance.client_nom}</td>
                  <td className="py-2">{creance.montant.toLocaleString("fr-FR")}</td>
                  <td className="py-2">
                    {creance.montant_rembourse.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-2">{STATUT_LABELS[creance.statut]}</td>
                  <td className="py-2">{creance.date_echeance ?? "—"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(creance.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(creance.id)}
                        disabled={deletingId === creance.id}
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
