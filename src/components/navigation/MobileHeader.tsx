"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MobileHeaderProps = {
  nomCommerce: string;
  email: string;
};

// En-tête sticky mobile (<1024px) + menu compte ancré en haut à droite —
// cf. mobile-header-menu.html. Réutilise le même poids de backdrop que
// les modales (bg-ink/55, z-[100]) pour assombrir tout l'écran, nav basse
// comprise.
export default function MobileHeader({ nomCommerce, email }: MobileHeaderProps) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-line bg-card px-[18px] py-4 lg:hidden">
        <span className="text-[17px] font-extrabold text-ink">
          Sama<span className="text-accent">·</span>Cahier
        </span>
        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-label="Menu du compte"
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
            className="absolute top-[66px] right-[18px] w-[220px] overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-line px-4 py-3.5">
              <p className="truncate text-sm font-bold text-ink">{nomCommerce}</p>
              <p className="mt-0.5 truncate text-xs text-ink-muted">{email}</p>
            </div>

            <Link
              href="/profil"
              onClick={() => setOuvert(false)}
              className="flex items-center gap-2.5 border-b border-line px-4 py-3 text-sm font-semibold text-ink"
            >
              <User className="h-4 w-4" /> Profil
            </Link>
            <Link
              href="/parametres"
              onClick={() => setOuvert(false)}
              className="flex items-center gap-2.5 border-b border-line px-4 py-3 text-sm font-semibold text-ink"
            >
              <Settings className="h-4 w-4" /> Paramètres
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-status-impaye"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  );
}
