"use client";

import { useState, type FormEvent } from "react";
import {
  createDepense,
  updateDepense,
  type DepenseFormInput,
} from "@/lib/depenses/queries";
import type { Depense } from "@/types/database";

type DepenseFormProps = {
  depense?: Depense;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function DepenseForm({ depense, onSuccess, onCancel }: DepenseFormProps) {
  const [libelle, setLibelle] = useState(depense?.libelle ?? "");
  const [categorie, setCategorie] = useState(depense?.categorie ?? "");
  const [montant, setMontant] = useState(depense?.montant ?? 0);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Libellé
        <input
          type="text"
          required
          value={libelle}
          onChange={(event) => setLibelle(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Catégorie
          <input
            type="text"
            value={categorie}
            onChange={(event) => setCategorie(event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Montant (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            required
            value={montant}
            onChange={(event) => setMontant(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          required
          value={dateDepense}
          onChange={(event) => setDateDepense(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : depense ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
