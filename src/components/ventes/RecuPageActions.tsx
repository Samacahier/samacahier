"use client";

import { useState } from "react";

export default function RecuPageActions() {
  const [copie, setCopie] = useState(false);

  async function handlePartager() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Reçu de vente", url });
      } catch {
        // Partage annulé par l'utilisateur — rien à faire.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white"
      >
        Imprimer
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex-1 rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-ink"
      >
        Enregistrer en PDF
      </button>
      <button
        type="button"
        onClick={handlePartager}
        className="flex-1 rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-ink"
      >
        {copie ? "Lien copié !" : "Partager"}
      </button>
    </div>
  );
}
