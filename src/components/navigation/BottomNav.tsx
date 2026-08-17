"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS_PRINCIPAUX = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/ventes", label: "Vente" },
  { href: "/depenses", label: "Dépenses" },
  { href: "/stocks", label: "Stock" },
];

const LIENS_PLUS = [
  { href: "/caisse", label: "Trésorerie" },
  { href: "/clients", label: "Clients" },
  { href: "/fournisseurs", label: "Fournisseurs" },
  { href: "/rapports", label: "Rapports" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [plusOuvert, setPlusOuvert] = useState(false);

  return (
    <>
      {plusOuvert && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
          onClick={() => setPlusOuvert(false)}
        >
          <div
            className="absolute right-0 bottom-16 left-0 mx-4 rounded-t-2xl bg-card p-4 text-ink sm:right-4 sm:left-auto sm:w-56 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ul className="flex flex-col gap-1">
              {LIENS_PLUS.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    onClick={() => setPlusOuvert(false)}
                    className="block rounded px-3 py-2 text-sm hover:bg-page"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-card text-ink lg:hidden">
        {LIENS_PRINCIPAUX.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            className={`flex-1 py-3 text-center text-xs ${
              pathname === lien.href ? "font-semibold text-accent" : "text-ink-muted"
            }`}
          >
            {lien.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setPlusOuvert((value) => !value)}
          className={`flex-1 py-3 text-center text-xs ${
            plusOuvert ? "font-semibold text-accent" : "text-ink-muted"
          }`}
        >
          Plus
        </button>
      </nav>
    </>
  );
}
