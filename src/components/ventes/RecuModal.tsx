"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import RecuContent, { type RecuData } from "./RecuContent";

type RecuModalProps = {
  data: RecuData;
  venteId: string;
  onClose: () => void;
};

const BOUTON =
  "flex-1 rounded-[10px] border border-line bg-card px-2.5 py-2.5 text-[12.5px] font-bold text-ink";

// Utilise le composant Modal partagé (carte centrée, même comportement
// que toutes les autres modales de l'app) — seuls le contenu (actions +
// reçu) et la logique de partage/impression restent propres à ce fichier.
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
    <Modal title="Prévisualisation du reçu" onClose={onClose} maxWidthClassName="max-w-[340px] sm:max-w-md">
      <div className="sticky top-0 -mx-6 mb-3 flex gap-2 bg-card px-6 pb-3">
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

      <RecuContent {...data} />
    </Modal>
  );
}
