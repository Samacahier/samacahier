"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import VenteForm from "./VenteForm";
import RecuModal from "./RecuModal";
import type { RecuData } from "./RecuContent";
import { deleteVente } from "@/lib/ventes/queries";
import type { Client, Commercant, Stock, Vente } from "@/types/database";

type VenteListProps = {
  ventes: Vente[];
  produits: Stock[];
  clients: Client[];
  commercant: Commercant | null;
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

export default function VenteList({ ventes, produits, clients, commercant }: VenteListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recuVente, setRecuVente] = useState<Vente | null>(null);

  const venteEnEdition = ventes.find((vente) => vente.id === editingId) ?? null;

  function nomClient(clientId: string | null): string {
    if (!clientId) return "Client comptant";
    return clients.find((client) => client.id === clientId)?.nom ?? "Client comptant";
  }

  function recuDataPour(vente: Vente): RecuData {
    return {
      nomCommerce: commercant?.nom_commerce ?? "Commerce",
      telephone: commercant?.telephone ?? null,
      adresse: commercant?.adresse ?? null,
      activite: commercant?.activite ?? null,
      clientNom: nomClient(vente.client_id),
      vente,
    };
  }

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
            onSuccess={(venteCreee) => {
              setShowCreateForm(false);
              setRecuVente(venteCreee);
            }}
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

      {recuVente && (
        <RecuModal
          data={recuDataPour(recuVente)}
          venteId={recuVente.id}
          onClose={() => setRecuVente(null)}
        />
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
                <tr key={vente.id} className="group border-b border-line">
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
                    <div className="flex gap-2 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setRecuVente(vente)}
                        className="underline"
                      >
                        Reçu
                      </button>
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
