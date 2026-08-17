"use client";

import { useState } from "react";
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
        <h1 className="text-2xl font-semibold">Produits</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouveau produit"}
        </button>
      </div>

      {showCreateForm && (
        <StockForm
          fournisseurs={fournisseurs}
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {stocks.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun produit enregistré.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Produit</th>
              <th className="py-2">Catégorie</th>
              <th className="py-2">Quantité</th>
              <th className="py-2">Unité</th>
              <th className="py-2">Prix achat</th>
              <th className="py-2">Prix vente</th>
              <th className="py-2">Fournisseur</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) =>
              editingId === stock.id ? (
                <tr key={stock.id}>
                  <td colSpan={9} className="py-2">
                    <StockForm
                      stock={stock}
                      fournisseurs={fournisseurs}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={stock.id} className="border-b">
                  <td className="py-2 text-zinc-500">{stock.code_produit}</td>
                  <td className="py-2">{stock.nom_article}</td>
                  <td className="py-2">{stock.categorie ?? "—"}</td>
                  <td
                    className={`py-2 ${
                      stock.quantite <= stock.seuil_alerte ? "text-red-600" : ""
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
                    <div className="flex gap-2">
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
