"use client";

import { useState, type KeyboardEvent } from "react";
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

  async function handleAjouter() {
    if (!nom.trim()) {
      setError("Le nom est requis.");
      return;
    }

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

  // Pas de <form> ici volontairement : ce bloc est imbriqué dans le
  // <form> de VenteForm, et le HTML interdit les formulaires imbriqués
  // (le navigateur ignorait la balise et le bouton finissait par
  // soumettre le formulaire de vente en cours de saisie du client — le
  // client n'était jamais enregistré). On intercepte donc Entrée
  // nous-mêmes plutôt que de la laisser remonter au formulaire parent.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAjouter();
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-page p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Nom du client"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink"
        />
        <input
          type="tel"
          placeholder="Téléphone (facultatif)"
          value={telephone}
          onChange={(event) => setTelephone(event.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-xl border border-line bg-card px-3 py-2 text-sm text-ink"
        />
      </div>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAjouter}
          disabled={loading}
          className="rounded-xl bg-accent px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-secondary px-3 py-1.5 text-sm text-ink"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
