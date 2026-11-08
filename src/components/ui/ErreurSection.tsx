"use client";

import { useEffect } from "react";

// Erreur dans une page de l'espace commerçant ou admin : affichée DANS le
// layout (menu conservé), avec un bouton pour réessayer sans recharger.
export default function ErreurSection({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-status-impaye bg-status-impaye-bg p-6">
        <h1 className="text-lg font-semibold text-ink">Impossible d&apos;afficher cette page</h1>
        <p className="text-sm text-ink-muted">
          Un problème est survenu pendant le chargement. Vérifiez votre connexion internet puis
          réessayez.
          {error.digest && ` Code à communiquer au support : ${error.digest}.`}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-accent px-4 py-2 font-medium text-white"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
