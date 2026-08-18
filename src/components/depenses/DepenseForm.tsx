"use client";

import { useState, type FormEvent } from "react";
import {
  createDepense,
  updateDepense,
  type DepenseFormInput,
} from "@/lib/depenses/queries";
import NumberField from "@/components/ui/NumberField";
import type { Depense, Fournisseur } from "@/types/database";

type DepenseFormProps = {
  depense?: Depense;
  fournisseurs: Fournisseur[];
  onSuccess: () => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

const SOURCES: { value: NonNullable<DepenseFormInput["source"]>; label: string }[] = [
  { value: "caisse", label: "Ma Caisse" },
  { value: "poche", label: "Ma Poche" },
];

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "virement", label: "Virement" },
  { value: "autre", label: "Autre" },
];

export default function DepenseForm({
  depense,
  fournisseurs,
  onSuccess,
  onCancel,
}: DepenseFormProps) {
  const [libelle, setLibelle] = useState(depense?.libelle ?? "");
  const [categorie, setCategorie] = useState(depense?.categorie ?? "");
  const [montant, setMontant] = useState(depense?.montant ?? 0);
  const [source, setSource] = useState<NonNullable<DepenseFormInput["source"]>>(
    depense?.source ?? "caisse",
  );
  const [modePaiement, setModePaiement] = useState(depense?.mode_paiement ?? "especes");
  const [fournisseurId, setFournisseurId] = useState(depense?.fournisseur_id ?? "");
  const [dateDepense, setDateDepense] = useState(
    depense?.date_depense ?? new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: DepenseFormInput = {
      libelle,
      categorie: categorie || null,
      montant,
      source,
      mode_paiement: modePaiement || null,
      fournisseur_id: fournisseurId || null,
      date_depense: dateDepense,
    };

    const result = depense
      ? await updateDepense(depense.id, input)
      : await createDepense(input);

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
        Description
        <input
          type="text"
          required
          value={libelle}
          onChange={(event) => setLibelle(event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Montant
          <NumberField min={0} required value={montant} onChange={setMontant} className={CHAMP} />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Catégorie
          <input
            type="text"
            value={categorie}
            onChange={(event) => setCategorie(event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Source
        <div className="flex gap-2">
          {SOURCES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSource(option.value)}
              className={`flex-1 rounded-xl border px-3 py-2 ${
                source === option.value
                  ? "border-accent bg-accent text-white"
                  : "border-line text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Mode de paiement
          <select
            value={modePaiement}
            onChange={(event) => setModePaiement(event.target.value)}
            className={CHAMP}
          >
            {MODES_PAIEMENT.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Fournisseur (facultatif)
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
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Date
        <input
          type="date"
          required
          value={dateDepense}
          onChange={(event) => setDateDepense(event.target.value)}
          className={CHAMP}
        />
      </label>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent px-3 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : depense ? "Modifier" : "Ajouter"}
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
