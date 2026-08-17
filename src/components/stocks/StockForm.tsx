"use client";

import { useState, type FormEvent } from "react";
import {
  createStock,
  updateStock,
  type StockFormInput,
} from "@/lib/stocks/queries";
import type { Stock } from "@/types/database";

type StockFormProps = {
  stock?: Stock;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function StockForm({ stock, onSuccess, onCancel }: StockFormProps) {
  const [nomArticle, setNomArticle] = useState(stock?.nom_article ?? "");
  const [quantite, setQuantite] = useState(stock?.quantite ?? 0);
  const [unite, setUnite] = useState(stock?.unite ?? "unité");
  const [prixUnitaire, setPrixUnitaire] = useState(stock?.prix_unitaire ?? 0);
  const [seuilAlerte, setSeuilAlerte] = useState(stock?.seuil_alerte ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: StockFormInput = {
      nom_article: nomArticle,
      quantite,
      unite,
      prix_unitaire: prixUnitaire || null,
      seuil_alerte: seuilAlerte,
    };

    const result = stock
      ? await updateStock(stock.id, input)
      : await createStock(input);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Article
        <input
          type="text"
          required
          value={nomArticle}
          onChange={(event) => setNomArticle(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Quantité
          <input
            type="number"
            min={0}
            step="any"
            required
            value={quantite}
            onChange={(event) => setQuantite(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Unité
          <input
            type="text"
            required
            value={unite}
            onChange={(event) => setUnite(event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Prix unitaire (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            value={prixUnitaire}
            onChange={(event) => setPrixUnitaire(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Seuil d&apos;alerte
          <input
            type="number"
            min={0}
            step="any"
            required
            value={seuilAlerte}
            onChange={(event) => setSeuilAlerte(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : stock ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
