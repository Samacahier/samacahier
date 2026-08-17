import type { ReactNode } from "react";
import Link from "next/link";

type Bullet = {
  mark: string;
  texte: string;
};

type AuthShellProps = {
  eyebrow: string;
  titre: string;
  sousTitre: string;
  brandTitre: string;
  brandBullets: Bullet[];
  progress?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

// Habillage commun à /login et /register (étapes 1 et 2) : panneau de marque
// à gauche sur desktop (≥980px), formulaire centré à droite. En dessous,
// panneau caché, simple bandeau de marque en haut. Les composants de
// formulaire eux-mêmes (children) ne sont pas modifiés par ce shell.
export default function AuthShell({
  eyebrow,
  titre,
  sousTitre,
  brandTitre,
  brandBullets,
  progress,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-page text-ink">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-hero-start to-hero-deep p-14 text-card min-[980px]:flex">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,249,239,0.05)_1.5px,transparent_1.5px)] [background-size:28px_28px]"
        />

        <div className="font-display relative text-xl font-extrabold">
          Sama<span className="text-accent">·</span>Cahier
        </div>

        <div className="relative">
          <h2 className="font-display mb-4 max-w-[15ch] text-3xl leading-tight font-bold">
            {brandTitre}
          </h2>
          <ul className="flex flex-col gap-3.5">
            {brandBullets.map((bullet) => (
              <li key={bullet.texte} className="flex items-start gap-3 text-sm text-card/80">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/25 text-xs font-bold text-accent">
                  {bullet.mark}
                </span>
                {bullet.texte}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-card/50">
          © {new Date().getFullYear()} Sama Cahier
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-6">
        <Link
          href="/"
          className="absolute top-7 left-8 hidden items-center gap-1.5 text-sm font-semibold text-ink-muted min-[980px]:flex"
        >
          ← Retour au site
        </Link>

        <div className="font-display absolute inset-x-0 top-7 flex items-center justify-center gap-1.5 text-[17px] font-extrabold min-[980px]:hidden">
          Sama<span className="text-accent">·</span>Cahier
        </div>

        <div className="mt-14 w-full max-w-[420px] min-[980px]:mt-0">
          {progress && <div className="mb-7">{progress}</div>}
          <p className="mb-2.5 text-xs font-bold tracking-[0.07em] text-accent-dark uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mb-2 text-[28px] font-bold">{titre}</h1>
          <p className="mb-8 text-sm text-ink-muted">{sousTitre}</p>

          {children}

          <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
