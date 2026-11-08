import type { ReactNode } from "react";

type EtatPageProps = {
  code?: string;
  titre: string;
  message: string;
  children?: ReactNode;
};

// Page plein écran commune aux états "hors parcours" : maintenance, 404,
// erreur inattendue. Volontairement sans dépendance (pas de requête, pas de
// contexte) pour pouvoir s'afficher même quand le reste de l'app est en panne.
export default function EtatPage({ code, titre, message, children }: EtatPageProps) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-card p-8 text-center">
        <span className="text-lg font-bold text-accent-dark">Sama Cahier</span>
        {code && <span className="font-mono text-5xl font-bold text-ink">{code}</span>}
        <h1 className="text-xl font-semibold text-ink">{titre}</h1>
        <p className="text-sm text-ink-muted">{message}</p>
        {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </main>
  );
}
