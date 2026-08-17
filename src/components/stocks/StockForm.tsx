"use client";

import { useState, type FormEvent } from "react";
import { createStock, updateStock, type StockFormInput } from "@/lib/stocks/queries";
import type { Fournisseur, Stock } from "@/types/database";

type StockFormProps = {
  stock?: Stock;
  fournisseurs: Fournisseur[];
  onSuccess: () => void;
  onCancel: () => void;
};

const CATEGORIES = [
  "Alimentaire",
  "Boissons",
  "Hygiène & Cosmétique",
  "Habillement",
  "Électronique",
  "Ménager",
  "Autre",
];

const UNITES = ["unité", "kg", "g", "litre", "sachet", "carton", "autre"];

export default function StockForm({
  stock,
  fournisseurs,
  onSuccess,
  onCancel,
}: StockFormProps) {
  const [nomArticle, setNomArticle] = useState(stock?.nom_article ?? "");
  const [categorie, setCategorie] = useState(stock?.categorie ?? "");
  const [unite, setUnite] = useState(stock?.unite ?? "unité");
  const [prixAchat, setPrixAchat] = useState(stock?.prix_achat ?? 0);
  const [prixVente, setPrixVente] = useState(stock?.prix_vente ?? 0);
  const [quantite, setQuantite] = useState(stock?.quantite ?? 0);
  const [seuilAlerte, setSeuilAlerte] = useState(stock?.seuil_alerte ?? 0);
  const [fournisseurId, setFournisseurId] = useState(stock?.fournisseur_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: StockFormInput = {
      nom_article: nomArticle,
      categorie: categorie || null,
      unite,
      prix_achat: prixAchat || null,
      prix_vente: prixVente || null,
      quantite,
      seuil_alerte: seuilAlerte,
      fournisseur_id: fournisseurId || null,
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
        ID produit
        <input
          type="text"
          disabled
          value={stock?.code_produit ?? "Généré automatiquement à la création"}
          className="rounded border bg-zinc-100 px-3 py-2 text-zinc-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Nom du produit
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
          Catégorie
          <select
            value={categorie}
            onChange={(event) => setCategorie(event.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="">—</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Unité
          <select
            value={unite}
            onChange={(event) => setUnite(event.target.value)}
            className="rounded border px-3 py-2"
          >
            {UNITES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Prix d&apos;achat (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            value={prixAchat}
            onChange={(event) => setPrixAchat(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Prix de vente (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            value={prixVente}
            onChange={(event) => setPrixVente(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Stock initial
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
          Stock minimum
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

      <label className="flex flex-col gap-1 text-sm">
        Fournisseur
        <select
          value={fournisseurId}
          onChange={(event) => setFournisseurId(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">—</option>
          {fournisseurs.map((fournisseur) => (
            <option key={fournisseur.id} value={fournisseur.id}>
              {fournisseur.nom}
            </option>
          ))}
        </select>
      </label>

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
