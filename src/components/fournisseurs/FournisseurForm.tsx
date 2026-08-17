"use client";

import { useState, type FormEvent } from "react";
import {
  createFournisseur,
  updateFournisseur,
  type FournisseurFormInput,
} from "@/lib/fournisseurs/queries";
import type { Fournisseur } from "@/types/database";

type FournisseurFormProps = {
  fournisseur?: Fournisseur;
  onSuccess: () => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function FournisseurForm({
  fournisseur,
  onSuccess,
  onCancel,
}: FournisseurFormProps) {
  const [nom, setNom] = useState(fournisseur?.nom ?? "");
  const [contact, setContact] = useState(fournisseur?.contact ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: FournisseurFormInput = {
      nom,
      contact: contact || null,
    };

    const result = fournisseur
      ? await updateFournisseur(fournisseur.id, input)
      : await createFournisseur(input);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom
        <input
          type="text"
          required
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Contact
        <input
          type="text"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          className={CHAMP}
        />
      </label>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : fournisseur ? "Modifier" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-secondary px-3 py-2 font-medium text-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
