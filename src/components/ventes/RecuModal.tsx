"use client";

import { useState } from "react";
import RecuContent, { type RecuData } from "./RecuContent";

type RecuModalProps = {
  data: RecuData;
  venteId: string;
  onClose: () => void;
};

const BOUTON = "flex-1 rounded-[10px] border border-line bg-card px-2.5 py-2.5 text-[12.5px] font-bold text-ink";

// Carte flottante centrée (jamais ancrée en bas), identique desktop et
// mobile — cf. bottom-sheet-correct.html. z-index au-dessus de la nav
// basse (z-50) pour que le backdrop l'assombrisse toujours entièrement.
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-5">
      <div className="flex max-h-[78vh] w-full max-w-[340px] flex-col rounded-[22px] bg-card shadow-2xl sm:max-w-md">
        <div className="flex items-center justify-between px-5 pt-4 pb-3.5">
          <h2 className="font-display text-[17px] font-bold">Prévisualisation du reçu</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-lg text-ink-muted"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 px-5 pb-3.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-[10px] bg-accent px-2.5 py-2.5 text-[12.5px] font-bold text-white"
          >
            Imprimer
          </button>
          <button type="button" onClick={() => window.print()} className={BOUTON}>
            Enregistrer en PDF
          </button>
          <button type="button" onClick={handlePartager} className={BOUTON}>
            {copie ? "Lien copié !" : "Partager"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <RecuContent {...data} />
        </div>

        <div style={{ height: "max(18px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  );
}
