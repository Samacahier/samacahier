"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
              className={`rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                actif ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
              }`}
            >
              {lien.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-xl px-4 py-2.5 text-left text-base font-medium text-ink-muted transition-colors hover:bg-page"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
