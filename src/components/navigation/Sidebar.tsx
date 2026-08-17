"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/ventes", label: "Ventes" },
  { href: "/depenses", label: "Dépenses" },
  { href: "/stocks", label: "Stock" },
  { href: "/caisse", label: "Trésorerie" },
  { href: "/clients", label: "Clients" },
  { href: "/fournisseurs", label: "Fournisseurs" },
  { href: "/rapports", label: "Rapports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-card p-6 lg:flex">
      <div className="mb-8 text-xl font-semibold text-ink">
        Sama<span className="text-accent">·</span>Cahier
      </div>

      <nav className="flex flex-col gap-1">
        {LIENS.map((lien) => {
          const actif = pathname === lien.href || pathname.startsWith(`${lien.href}/`);

          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                actif ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
              }`}
            >
              {lien.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
