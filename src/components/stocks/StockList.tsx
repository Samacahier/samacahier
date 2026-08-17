"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import StockForm from "./StockForm";
import { deleteStock } from "@/lib/stocks/queries";
import type { Fournisseur, Stock } from "@/types/database";

type StockListProps = {
  stocks: Stock[];
  fournisseurs: Fournisseur[];
};

export default function StockList({ stocks, fournisseurs }: StockListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stockEnEdition = stocks.find((stock) => stock.id === editingId) ?? null;

  const nomFournisseur = (id: string | null) =>
    fournisseurs.find((fournisseur) => fournisseur.id === id)?.nom ?? "—";

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cet article ?")) return;

    setDeletingId(id);
    await deleteStock(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Produits</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          Nouveau produit
        </button>
      </div>

      {showCreateForm && (
        <Modal title="Nouveau produit" onClose={() => setShowCreateForm(false)}>
          <StockForm
            fournisseurs={fournisseurs}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {stockEnEdition && (
        <Modal title="Modifier le produit" onClose={() => setEditingId(null)}>
          <StockForm
            stock={stockEnEdition}
            fournisseurs={fournisseurs}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      {stocks.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun produit enregistré.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">ID</th>
                <th className="py-2 text-ink-muted">Produit</th>
                <th className="py-2 text-ink-muted">Catégorie</th>
                <th className="py-2 text-ink-muted">Quantité</th>
                <th className="py-2 text-ink-muted">Unité</th>
                <th className="py-2 text-ink-muted">Prix achat</th>
                <th className="py-2 text-ink-muted">Prix vente</th>
                <th className="py-2 text-ink-muted">Fournisseur</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="group border-b border-line">
                  <td className="py-2 text-ink-muted">{stock.code_produit}</td>
                  <td className="py-2">{stock.nom_article}</td>
                  <td className="py-2">{stock.categorie ?? "—"}</td>
                  <td
                    className={`py-2 ${
                      stock.quantite <= stock.seuil_alerte
                        ? "font-medium text-status-impaye"
                        : ""
                    }`}
                  >
                    {stock.quantite}
                  </td>
                  <td className="py-2">{stock.unite}</td>
                  <td className="py-2">
                    {stock.prix_achat?.toLocaleString("fr-FR") ?? "—"}
                  </td>
                  <td className="py-2">
                    {stock.prix_vente?.toLocaleString("fr-FR") ?? "—"}
                  </td>
                  <td className="py-2">{nomFournisseur(stock.fournisseur_id)}</td>
                  <td className="py-2">
                    <div className="flex gap-2 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setEditingId(stock.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(stock.id)}
                        disabled={deletingId === stock.id}
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
