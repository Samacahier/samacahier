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
        <h2 className="text-lg font-semibold text-ink">Créances</h2>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
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
        <p className="text-sm text-ink-muted">Aucune créance enregistrée.</p>
      ) : (
        <>
          {/* Mobile/tablette (<1024px) : cartes empilées */}
          <div className="flex flex-col gap-3 lg:hidden">
            {creances.map((creance) =>
              editingId === creance.id ? (
                <CreanceForm
                  key={creance.id}
                  creance={creance}
                  onSuccess={() => setEditingId(null)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div key={creance.id} className="rounded-2xl bg-card p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="font-medium text-ink">{creance.client_nom}</p>
                    <span className="shrink-0 text-sm text-ink-muted">
                      {STATUT_LABELS[creance.statut]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <span>Dû : {creance.montant.toLocaleString("fr-FR")} FCFA</span>
                    <span>
                      Remboursé : {creance.montant_rembourse.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span>Échéance : {creance.date_echeance ?? "—"}</span>
                  </div>
                  <div className="mt-3 flex gap-3 border-t border-line pt-3 text-sm">
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
                      className="text-status-impaye underline disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Desktop (≥1024px) : table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-card p-4 lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Client</th>
                <th className="py-2 text-ink-muted">Dû</th>
                <th className="py-2 text-ink-muted">Remboursé</th>
                <th className="py-2 text-ink-muted">Statut</th>
                <th className="py-2 text-ink-muted">Échéance</th>
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
                  <tr key={creance.id} className="group border-b border-line">
                    <td className="py-2">{creance.client_nom}</td>
                    <td className="py-2">{creance.montant.toLocaleString("fr-FR")}</td>
                    <td className="py-2">
                      {creance.montant_rembourse.toLocaleString("fr-FR")}
                    </td>
                    <td className="py-2">{STATUT_LABELS[creance.statut]}</td>
                    <td className="py-2">{creance.date_echeance ?? "—"}</td>
                    <td className="py-2">
                      <div className="flex gap-2 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
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
                          className="text-status-impaye underline disabled:opacity-50"
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
          </div>
        </>
      )}
    </div>
  );
}
