"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  const estCommercants =
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/") ||
    pathname.startsWith("/admin/commercants");
  const estCompte = pathname === "/admin/compte";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-card p-7 lg:flex">
      <div className="mb-10 text-2xl font-semibold text-ink">
        Sama<span className="text-accent">·</span>Cahier
      </div>

      <nav className="flex flex-col gap-1.5">
        <Link
          href="/admin/dashboard"
          className={`rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
            estCommercants ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
          }`}
        >
          Commerçants
        </Link>
        <Link
          href="/admin/compte"
          className={`rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
            estCompte ? "bg-accent text-white" : "text-ink-muted hover:bg-page"
          }`}
        >
          Mon compte
        </Link>
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
