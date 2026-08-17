"use client";

import { useState } from "react";
import StockForm from "./StockForm";
import { deleteStock } from "@/lib/stocks/queries";
import type { Stock } from "@/types/database";

type StockListProps = {
  stocks: Stock[];
};

export default function StockList({ stocks }: StockListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cet article ?")) return;

    setDeletingId(id);
    await deleteStock(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stocks</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouvel article"}
        </button>
      </div>

      {showCreateForm && (
        <StockForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {stocks.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun article en stock.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Article</th>
              <th className="py-2">Quantité</th>
              <th className="py-2">Unité</th>
              <th className="py-2">Prix unit.</th>
              <th className="py-2">Seuil alerte</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) =>
              editingId === stock.id ? (
                <tr key={stock.id}>
                  <td colSpan={6} className="py-2">
                    <StockForm
                      stock={stock}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={stock.id} className="border-b">
                  <td className="py-2">{stock.nom_article}</td>
                  <td
                    className={`py-2 ${
                      stock.quantite <= stock.seuil_alerte ? "text-red-600" : ""
                    }`}
                  >
                    {stock.quantite}
                  </td>
                  <td className="py-2">{stock.unite}</td>
                  <td className="py-2">
                    {stock.prix_unitaire?.toLocaleString("fr-FR") ?? "—"}
                  </td>
                  <td className="py-2">{stock.seuil_alerte}</td>
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
