"use client";

import { useState } from "react";
import RecuContent, { type RecuData } from "./RecuContent";

type RecuModalProps = {
  data: RecuData;
  venteId: string;
  onClose: () => void;
};

export default function RecuModal({ data, venteId, onClose }: RecuModalProps) {
  const [copie, setCopie] = useState(false);

  async function handlePartager() {
    const url = `${window.location.origin}/ventes/${venteId}/recu`;

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 lg:items-center">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card text-ink lg:rounded-2xl">
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-line px-6 py-4 print:hidden">
          <h2 className="text-lg font-semibold">Prévisualisation du reçu</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="text-2xl leading-none text-ink-muted"
            >
              ×
            </button>
          </div>
        </div>

        <div className="overflow-y-auto bg-page px-6 py-6">
          <RecuContent {...data} />
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2 border-t border-line px-6 py-4 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-ink"
          >
            Fermer
          </button>
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
      </div>
    </div>
  );
}
