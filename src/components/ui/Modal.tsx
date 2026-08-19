"use client";

import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
};

// Composant de modale unique partagé par toute l'app : carte flottante
// centrée (jamais bottom-sheet), identique desktop et mobile, marges
// visibles sur les 4 côtés, coins arrondis partout. Backdrop en z-[100],
// au-dessus de la nav basse et de la sidebar (toutes deux z-50), qui
// apparaissent donc bien assombries dessous plutôt que par-dessus.
export default function Modal({
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-lg",
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-5">
      <div
        className={`flex max-h-[90vh] w-full ${maxWidthClassName} flex-col rounded-[22px] bg-card text-ink shadow-2xl`}
      >
        <div className="flex flex-shrink-0 items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-2xl leading-none text-ink-muted"
          >
            ×
          </button>
        </div>

        <div className="overflow-x-hidden overflow-y-auto px-6 pb-2">{children}</div>

        <div style={{ height: "max(18px, env(safe-area-inset-bottom))" }} />
      </div>
    </div>
  );
}
