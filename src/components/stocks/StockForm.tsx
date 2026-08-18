"use client";

import { useState, type FormEvent } from "react";
import { createStock, updateStock, type StockFormInput } from "@/lib/stocks/queries";
import NumberField from "@/components/ui/NumberField";
import type { Fournisseur, Stock } from "@/types/database";

type StockFormProps = {
  stock?: Stock;
  fournisseurs: Fournisseur[];
  onSuccess: () => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        ID produit
        <input
          type="text"
          disabled
          value={stock?.code_produit ?? "Généré automatiquement à la création"}
          className={`${CHAMP} bg-page text-ink-muted`}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom du produit
        <input
          type="text"
          required
          value={nomArticle}
          onChange={(event) => setNomArticle(event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Catégorie
          <select
            value={categorie}
            onChange={(event) => setCategorie(event.target.value)}
            className={CHAMP}
          >
            <option value="">—</option>
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Unité
          <select
            value={unite}
            onChange={(event) => setUnite(event.target.value)}
            className={CHAMP}
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
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Prix d&apos;achat (FCFA)
          <NumberField min={0} value={prixAchat} onChange={setPrixAchat} className={CHAMP} />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Prix de vente (FCFA)
          <NumberField min={0} value={prixVente} onChange={setPrixVente} className={CHAMP} />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Stock initial
          <NumberField min={0} required value={quantite} onChange={setQuantite} className={CHAMP} />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Stock minimum
          <NumberField min={0} required value={seuilAlerte} onChange={setSeuilAlerte} className={CHAMP} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Fournisseur
        <select
          value={fournisseurId}
          onChange={(event) => setFournisseurId(event.target.value)}
          className={CHAMP}
        >
          <option value="">—</option>
          {fournisseurs.map((fournisseur) => (
            <option key={fournisseur.id} value={fournisseur.id}>
              {fournisseur.nom}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex flex-col gap-2 bg-card px-6 pt-3 pb-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent px-3 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : stock ? "Modifier" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl bg-secondary px-3 py-3 font-medium text-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
