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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Nom
        <input
          type="text"
          required
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Contact
        <input
          type="text"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
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
          {loading ? "Enregistrement..." : fournisseur ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
