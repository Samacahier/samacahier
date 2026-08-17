"use client";

import { useState, type FormEvent } from "react";
import {
  createClient,
  updateClient,
  type ClientFormInput,
} from "@/lib/clients/queries";
import type { Client } from "@/types/database";

type ClientFormProps = {
  client?: Client;
  onSuccess: () => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const [nom, setNom] = useState(client?.nom ?? "");
  const [telephone, setTelephone] = useState(client?.telephone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: ClientFormInput = {
      nom,
      telephone: telephone || null,
    };

    const result = client
      ? await updateClient(client.id, input)
      : await createClient(input);

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
        Téléphone
        <input
          type="tel"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
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
          {loading ? "Enregistrement..." : client ? "Modifier" : "Ajouter"}
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
