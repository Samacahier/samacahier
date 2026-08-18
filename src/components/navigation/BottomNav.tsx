"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Wallet,
  Package,
  Landmark,
  Users,
  Truck,
  BarChart3,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

const LIENS_PRINCIPAUX: { href: string; label: string; Icone: LucideIcon }[] = [
  { href: "/dashboard", label: "Accueil", Icone: Home },
  { href: "/ventes", label: "Vente", Icone: ShoppingCart },
  { href: "/depenses", label: "Dépenses", Icone: Wallet },
  { href: "/stocks", label: "Stock", Icone: Package },
];

const LIENS_PLUS: { href: string; label: string; Icone: LucideIcon }[] = [
  { href: "/caisse", label: "Trésorerie", Icone: Landmark },
  { href: "/clients", label: "Clients", Icone: Users },
  { href: "/fournisseurs", label: "Fournisseurs", Icone: Truck },
  { href: "/rapports", label: "Rapports", Icone: BarChart3 },
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
                    className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-page"
                  >
                    <lien.Icone className="h-4 w-4 shrink-0" />
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
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center text-sm ${
              pathname === lien.href ? "font-semibold text-accent" : "text-ink-muted"
            }`}
          >
            <lien.Icone className="h-5 w-5" />
            {lien.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setPlusOuvert((value) => !value)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center text-sm ${
            plusOuvert ? "font-semibold text-accent" : "text-ink-muted"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          Plus
        </button>
      </nav>
    </>
  );
}
