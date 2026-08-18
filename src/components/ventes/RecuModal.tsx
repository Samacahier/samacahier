"use client";

import { useState } from "react";
import RecuContent, { type RecuData } from "./RecuContent";

type RecuModalProps = {
  data: RecuData;
  venteId: string;
  onClose: () => void;
};

const BOUTON_NEUTRE =
  "rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink whitespace-nowrap";

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
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-page text-ink lg:rounded-2xl">
        <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold whitespace-nowrap">Prévisualisation du reçu</h2>
            <select
              defaultValue="thermique-80"
              className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
            >
              <option value="thermique-80">Thermique 80 mm</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onClose} className={BOUTON_NEUTRE}>
              Fermer
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white"
            >
              Imprimer
            </button>
            <button type="button" onClick={() => window.print()} className={BOUTON_NEUTRE}>
              Enregistrer en PDF
            </button>
            <button type="button" onClick={handlePartager} className={BOUTON_NEUTRE}>
              {copie ? "Lien copié !" : "Partager"}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 pb-6">
          <RecuContent {...data} />
        </div>
      </div>
    </div>
  );
}
