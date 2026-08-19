"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LIENS = [
  { href: "/admin/vue-ensemble", label: "Vue d'ensemble" },
  { href: "/admin/dashboard", label: "Commerçants", aussi: "/admin/commercants" },
  { href: "/admin/rapports", label: "Rapports plateforme" },
  { href: "/admin/journal", label: "Journal d'activité" },
  { href: "/admin/compte", label: "Mon compte" },
];

// En-tête sticky mobile (<1024px) pour l'espace admin : AdminSidebar est
// masquée en dessous de 1024px (lg:flex), ce qui ne laissait aucun moyen
// de naviguer sur téléphone.
export default function AdminMobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-line bg-card px-6 lg:hidden">
        <span className="text-[17px] font-extrabold text-ink">
          Sama<span className="text-accent">·</span>Cahier
        </span>
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Menu de navigation"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-secondary"
        >
          <Menu className="h-[18px] w-[18px] text-ink" />
        </button>
      </header>

      {ouvert && (
        <div
          className="fixed inset-0 z-[100] bg-ink/55 lg:hidden"
          onClick={() => setOuvert(false)}
        >
          <div
            className="absolute top-0 right-0 flex h-full w-[260px] flex-col border-l border-line bg-card p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Fermer le menu"
              className="mb-6 flex h-[34px] w-[34px] items-center justify-center self-end rounded-[10px] bg-secondary"
            >
              <X className="h-[16px] w-[16px] text-ink" />
            </button>

            <nav className="flex flex-col gap-1.5">
              {LIENS.map((lien) => {
                const actif =
                  pathname === lien.href ||
                  pathname.startsWith(`${lien.href}/`) ||
                  (lien.aussi && pathname.startsWith(lien.aussi));

                return (
                  <Link
                    key={lien.href}
                    href={lien.href}
                    onClick={() => setOuvert(false)}
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
          </div>
        </div>
      )}
    </>
  );
}
