"use client";

import { useEffect } from "react";
import Link from "next/link";
import EtatPage from "@/components/ui/EtatPage";

// Erreur inattendue dans une page : remplace l'écran blanc / le message
// technique par une page claire avec un bouton "Réessayer". Le détail
// technique reste dans la console et les logs serveur (digest).
export default function ErreurPage({
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
    <EtatPage
      titre="Une erreur est survenue"
      message={`Un problème inattendu nous empêche d'afficher cette page. Réessayez ; si le problème persiste, contactez le support${
        error.digest ? ` en indiquant le code ${error.digest}` : ""
      }.`}
    >
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-accent px-4 py-2 font-medium text-white"
      >
        Réessayer
      </button>
      <Link href="/dashboard" className="rounded-xl bg-secondary px-4 py-2 font-medium text-ink">
        Tableau de bord
      </Link>
    </EtatPage>
  );
}
