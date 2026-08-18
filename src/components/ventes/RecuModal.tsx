"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import RecuContent, { type RecuData } from "./RecuContent";

type RecuModalProps = {
  data: RecuData;
  venteId: string;
  onClose: () => void;
};

const BOUTON_NEUTRE =
  "flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink whitespace-nowrap";

// Réutilise le composant Modal partagé (même bottom-sheet mobile / centrage
// desktop que VenteForm, DepenseForm, etc.) — les boutons d'action vivent
// dans le corps scrollable, juste au-dessus du reçu, donc ancrés dans la
// modale et jamais détachés.
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
    <Modal title="Prévisualisation du reçu" onClose={onClose}>
      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onClose} className={BOUTON_NEUTRE}>
            Fermer
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium whitespace-nowrap text-white"
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

      <div className="mt-4">
        <RecuContent {...data} />
      </div>
    </Modal>
  );
}
