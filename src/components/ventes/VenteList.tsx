"use client";

import { useState } from "react";
import Link from "next/link";
import VenteForm from "./VenteForm";
import { deleteVente } from "@/lib/ventes/queries";
import type { Vente } from "@/types/database";

type VenteListProps = {
  ventes: Vente[];
};

export default function VenteList({ ventes }: VenteListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouvelle vente"}
        </button>
      </div>

      {showCreateForm && (
        <VenteForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
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
              <th className="py-2">Prix unit.</th>
              <th className="py-2">Total</th>
              <th className="py-2">Paiement</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) =>
              editingId === vente.id ? (
                <tr key={vente.id}>
                  <td colSpan={7} className="py-2">
                    <VenteForm
                      vente={vente}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={vente.id} className="border-b">
                  <td className="py-2">{vente.date_vente}</td>
                  <td className="py-2">{vente.description}</td>
                  <td className="py-2">{vente.quantite}</td>
                  <td className="py-2">{vente.prix_unitaire.toLocaleString("fr-FR")}</td>
                  <td className="py-2">{vente.montant_total.toLocaleString("fr-FR")}</td>
                  <td className="py-2">{vente.mode_paiement}</td>
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
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
