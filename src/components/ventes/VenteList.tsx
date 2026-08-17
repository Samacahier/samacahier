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
  paye: "bg-green-100 text-green-800",
  credit: "bg-amber-100 text-amber-800",
  impaye: "bg-red-100 text-red-800",
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
        <h1 className="text-2xl font-semibold">Ventes</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded bg-black px-3 py-2 text-white"
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
        <p className="text-sm text-zinc-600">Aucune vente enregistrée.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Description</th>
              <th className="py-2">Qté</th>
              <th className="py-2">Total</th>
              <th className="py-2">Statut</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) => (
              <tr key={vente.id} className="border-b">
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
                      className="text-red-600 underline disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
