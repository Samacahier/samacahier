import Link from "next/link";
import type { ReactNode } from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
};

const FENETRE = 1;

// Fenêtre de pages autour de la page courante, avec la première et la
// dernière toujours visibles et des "…" pour le reste : ex. 1 … 4 5 6 … 12.
function pagesAAfficher(page: number, totalPages: number): (number | "…")[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - FENETRE; p <= page + FENETRE; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }

  const triees = [...pages].sort((a, b) => a - b);
  const resultat: (number | "…")[] = [];
  for (let i = 0; i < triees.length; i++) {
    if (i > 0 && triees[i] - triees[i - 1] > 1) resultat.push("…");
    resultat.push(triees[i]);
  }
  return resultat;
}

export default function Pagination({ page, totalPages, makeHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
    >
      <LienPage href={makeHref(page - 1)} desactive={page <= 1}>
        ← Précédent
      </LienPage>

      {pagesAAfficher(page, totalPages).map((p, index) =>
        p === "…" ? (
          <span key={`ellipsis-${index}`} className="px-1.5 text-sm text-ink-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={`min-w-[36px] rounded-lg px-3 py-1.5 text-center text-sm font-medium ${
              p === page ? "bg-accent text-white" : "text-ink hover:bg-page"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <LienPage href={makeHref(page + 1)} desactive={page >= totalPages}>
        Suivant →
      </LienPage>
    </nav>
  );
}

function LienPage({
  href,
  desactive,
  children,
}: {
  href: string;
  desactive: boolean;
  children: ReactNode;
}) {
  if (desactive) {
    return (
      <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted/50">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink hover:bg-page">
      {children}
    </Link>
  );
}
