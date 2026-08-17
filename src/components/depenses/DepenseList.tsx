"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import DepenseForm from "./DepenseForm";
import { deleteDepense } from "@/lib/depenses/queries";
import type { Depense, Fournisseur } from "@/types/database";

type DepenseListProps = {
  depenses: Depense[];
  fournisseurs: Fournisseur[];
};

const SOURCE_LABELS: Record<Depense["source"], string> = {
  caisse: "Ma Caisse",
  poche: "Ma Poche",
};

export default function DepenseList({ depenses, fournisseurs }: DepenseListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const depenseEnEdition = depenses.find((depense) => depense.id === editingId) ?? null;

  const nomFournisseur = (id: string | null) =>
    fournisseurs.find((fournisseur) => fournisseur.id === id)?.nom ?? "—";

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette dépense ?")) return;

    setDeletingId(id);
    await deleteDepense(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Dépenses</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          Nouvelle dépense
        </button>
      </div>

      {showCreateForm && (
        <Modal title="Nouvelle dépense" onClose={() => setShowCreateForm(false)}>
          <DepenseForm
            fournisseurs={fournisseurs}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {depenseEnEdition && (
        <Modal title="Modifier la dépense" onClose={() => setEditingId(null)}>
          <DepenseForm
            depense={depenseEnEdition}
            fournisseurs={fournisseurs}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      {depenses.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucune dépense enregistrée.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Date</th>
                <th className="py-2 text-ink-muted">Libellé</th>
                <th className="py-2 text-ink-muted">Catégorie</th>
                <th className="py-2 text-ink-muted">Source</th>
                <th className="py-2 text-ink-muted">Fournisseur</th>
                <th className="py-2 text-ink-muted">Montant</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {depenses.map((depense) => (
                <tr key={depense.id} className="border-b border-line">
                  <td className="py-2">{depense.date_depense}</td>
                  <td className="py-2">{depense.libelle}</td>
                  <td className="py-2">{depense.categorie ?? "—"}</td>
                  <td className="py-2">{SOURCE_LABELS[depense.source]}</td>
                  <td className="py-2">{nomFournisseur(depense.fournisseur_id)}</td>
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
                        className="text-status-impaye underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
