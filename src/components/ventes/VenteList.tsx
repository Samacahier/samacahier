"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import VenteForm from "./VenteForm";
import { deleteVente } from "@/lib/ventes/queries";
import type { Client, Stock, Vente } from "@/types/database";

type VenteListProps = {
  ventes: Vente[];
  produits: Stock[];
  clients: Client[];
};

const STATUT_LABELS: Record<Vente["statut"], string> = {
  paye: "Payé",
  credit: "Crédit",
  impaye: "Impayé",
};

const STATUT_BADGE: Record<Vente["statut"], string> = {
  paye: "bg-status-paye-bg text-status-paye",
  credit: "bg-status-credit-bg text-status-credit",
  impaye: "bg-status-impaye-bg text-status-impaye",
};

export default function VenteList({ ventes, produits, clients }: VenteListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const venteEnEdition = ventes.find((vente) => vente.id === editingId) ?? null;

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette vente ?")) return;

    setDeletingId(id);
    await deleteVente(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Ventes</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          Nouvelle vente
        </button>
      </div>

      {showCreateForm && (
        <Modal title="Nouvelle vente" onClose={() => setShowCreateForm(false)}>
          <VenteForm
            produits={produits}
            clients={clients}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {venteEnEdition && (
        <Modal title="Modifier la vente" onClose={() => setEditingId(null)}>
          <VenteForm
            vente={venteEnEdition}
            produits={produits}
            clients={clients}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      {ventes.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucune vente enregistrée.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Date</th>
                <th className="py-2 text-ink-muted">Description</th>
                <th className="py-2 text-ink-muted">Qté</th>
                <th className="py-2 text-ink-muted">Total</th>
                <th className="py-2 text-ink-muted">Statut</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {ventes.map((vente) => (
                <tr key={vente.id} className="border-b border-line">
                  <td className="py-2">{vente.date_vente}</td>
                  <td className="py-2">{vente.description}</td>
                  <td className="py-2">{vente.quantite}</td>
                  <td className="py-2">{vente.montant_total.toLocaleString("fr-FR")}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUT_BADGE[vente.statut]}`}
                    >
                      {STATUT_LABELS[vente.statut]}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/ventes/${vente.id}/recu`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Reçu
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingId(vente.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(vente.id)}
                        disabled={deletingId === vente.id}
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
