"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/clients/queries";
import type { Client } from "@/types/database";

type AjoutClientRapideProps = {
  onCreated: (client: Client) => void;
  onCancel: () => void;
};

export default function AjoutClientRapide({ onCreated, onCancel }: AjoutClientRapideProps) {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await createClient({ nom, telephone: telephone || null });

    setLoading(false);

    if (result.error || !result.client) {
      setError(result.error ?? "Impossible de créer le client.");
      return;
    }

    onCreated(result.client);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded border p-3">
      <div className="flex gap-2">
        <input
          type="text"
          required
          placeholder="Nom du client"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <input
          type="tel"
          placeholder="Téléphone (facultatif)"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-3 py-1.5 text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
