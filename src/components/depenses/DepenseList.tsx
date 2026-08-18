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
        <>
          {/* Mobile/tablette (<1024px) : cartes empilées */}
          <div className="flex flex-col gap-3 lg:hidden">
            {depenses.map((depense) => (
              <div key={depense.id} className="rounded-2xl bg-card p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{depense.libelle}</p>
                    <p className="text-sm text-ink-muted">{depense.date_depense}</p>
                  </div>
                  <span className="font-medium text-ink">
                    {depense.montant.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                  <span>{depense.categorie ?? "—"}</span>
                  <span>{SOURCE_LABELS[depense.source]}</span>
                  <span>{nomFournisseur(depense.fournisseur_id)}</span>
                </div>
                <div className="mt-3 flex gap-3 border-t border-line pt-3 text-sm">
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
              </div>
            ))}
          </div>

          {/* Desktop (≥1024px) : table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-card p-4 lg:block">
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
                <tr key={depense.id} className="group border-b border-line">
                  <td className="py-2">{depense.date_depense}</td>
                  <td className="py-2">{depense.libelle}</td>
                  <td className="py-2">{depense.categorie ?? "—"}</td>
                  <td className="py-2">{SOURCE_LABELS[depense.source]}</td>
                  <td className="py-2">{nomFournisseur(depense.fournisseur_id)}</td>
                  <td className="py-2">{depense.montant.toLocaleString("fr-FR")}</td>
                  <td className="py-2">
                    <div className="flex gap-2 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
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
        </>
      )}
    </div>
  );
}
