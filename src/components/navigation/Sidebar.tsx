"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  ShoppingCart,
  Wallet,
  Package,
  Landmark,
  Users,
  Truck,
  BarChart3,
  User,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

const LIENS: { href: string; label: string; Icone: LucideIcon }[] = [
  { href: "/dashboard", label: "Accueil", Icone: Home },
  { href: "/ventes", label: "Ventes", Icone: ShoppingCart },
  { href: "/depenses", label: "Dépenses", Icone: Wallet },
  { href: "/stocks", label: "Stock", Icone: Package },
  { href: "/caisse", label: "Trésorerie", Icone: Landmark },
  { href: "/clients", label: "Clients", Icone: Users },
  { href: "/fournisseurs", label: "Fournisseurs", Icone: Truck },
  { href: "/rapports", label: "Rapports", Icone: BarChart3 },
];

const LIENS_COMPTE: { href: string; label: string; Icone: LucideIcon }[] = [
  { href: "/profil", label: "Profil", Icone: User },
  { href: "/parametres", label: "Paramètres", Icone: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-card p-7 lg:flex">
      <div className="mb-10 text-2xl font-semibold text-ink">
        Sama<span className="text-accent">·</span>Cahier
      </div>

      <nav className="flex flex-col gap-1.5">
        {LIENS.map((lien) => {
          const actif = pathname === lien.href || pathname.startsWith(`${lien.href}/`);

          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                actif ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
              }`}
            >
              <lien.Icone className="h-5 w-5 shrink-0" />
              {lien.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4">
        {LIENS_COMPTE.map((lien) => {
          const actif = pathname === lien.href || pathname.startsWith(`${lien.href}/`);

          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                actif ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
              }`}
            >
              <lien.Icone className="h-5 w-5 shrink-0" />
              {lien.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-base font-medium text-ink-muted transition-colors hover:bg-page"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
