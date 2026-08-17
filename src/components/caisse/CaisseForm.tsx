"use client";

import { useState, type FormEvent } from "react";
import {
  createMouvement,
  updateMouvement,
  type CaisseFormInput,
} from "@/lib/caisse/queries";
import type { Caisse } from "@/types/database";

type CaisseFormProps = {
  mouvement?: Caisse;
  onSuccess: () => void;
  onCancel: () => void;
};

const TYPES_MOUVEMENT = [
  { value: "entree", label: "Entrée" },
  { value: "sortie", label: "Sortie" },
] as const;

export default function CaisseForm({ mouvement, onSuccess, onCancel }: CaisseFormProps) {
  const [typeMouvement, setTypeMouvement] = useState<CaisseFormInput["type_mouvement"]>(
    mouvement?.type_mouvement ?? "entree",
  );
  const [montant, setMontant] = useState(mouvement?.montant ?? 0);
  const [motif, setMotif] = useState(mouvement?.motif ?? "");
  const [dateMouvement, setDateMouvement] = useState(
    mouvement?.date_mouvement.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: CaisseFormInput = {
      type_mouvement: typeMouvement,
      montant,
      motif: motif || null,
      date_mouvement: dateMouvement,
    };

    const result = mouvement
      ? await updateMouvement(mouvement.id, input)
      : await createMouvement(input);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border p-4">
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Type
          <select
            value={typeMouvement}
            onChange={(event) =>
              setTypeMouvement(event.target.value as CaisseFormInput["type_mouvement"])
            }
            className="rounded border px-3 py-2"
          >
            {TYPES_MOUVEMENT.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
        Motif
        <input
          type="text"
          value={motif}
          onChange={(event) => setMotif(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          required
          value={dateMouvement}
          onChange={(event) => setDateMouvement(event.target.value)}
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
          {loading ? "Enregistrement..." : mouvement ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
