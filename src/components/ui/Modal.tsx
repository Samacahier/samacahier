"use client";

import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 lg:items-center">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card text-ink lg:rounded-2xl">
        <div className="flex-shrink-0 px-6 pt-6">
          <div className="mb-2 flex justify-center lg:hidden">
            <span className="h-1.5 w-12 rounded-full bg-line" />
          </div>
          <div className="mb-4 flex items-center justify-between">
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
        </div>
        <div
          className="overflow-y-auto px-6 pb-6"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
