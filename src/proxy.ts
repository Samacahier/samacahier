import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const COMMERCANT_PATHS = [
  "/dashboard",
  "/ventes",
  "/depenses",
  "/stocks",
  "/caisse",
  "/rapports",
  "/clients",
  "/fournisseurs",
  "/profil",
  "/parametres",
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Mode maintenance -------------------------------------------------
  // Restent accessibles : l'espace admin (connexion + pages, déjà protégées
  // ci-dessous), la page /maintenance et les images générées. Tout le reste
  // est réécrit vers /maintenance (HTTP 503) pour les non-admins.
  const exempteMaintenance =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/maintenance" ||
    pathname === "/icon" ||
    pathname === "/opengraph-image";

  const enMaintenance = await lireMaintenanceActive(supabase);

  if (pathname === "/maintenance" && !enMaintenance) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (enMaintenance && !exempteMaintenance) {
    const estAdmin = user ? await estAdministrateur(supabase, user.id) : false;
    if (!estAdmin) {
      const reecriture = NextResponse.rewrite(new URL("/maintenance", request.url), {
        status: 503,
      });
      reecriture.headers.set("Retry-After", "300");
      return reecriture;
    }
  }

  // "/admin" (page de connexion) reste hors protection : seules les
  // sous-routes (ex. /admin/dashboard) sont réservées aux admins, sinon
  // un non-admin redirigé vers /admin y boucle indéfiniment.
  const isAdminRoute = pathname.startsWith("/admin/");
  const isCommercantRoute = COMMERCANT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!(await estAdministrateur(supabase, user.id))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } else if (isCommercantRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

type ClientProxy = ReturnType<typeof createServerClient<Database>>;

async function estAdministrateur(supabase: ClientProxy, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin";
}

// L'état de maintenance est lu à chaque requête : on le garde 15 s en
// mémoire (par instance serveur) pour ne pas ajouter une requête Supabase à
// chaque page vue. Conséquence : un changement depuis l'admin met jusqu'à
// ~15 s à s'appliquer partout. En cas d'erreur de lecture, le site reste
// ouvert (on ne bloque pas les utilisateurs sur une panne de lecture).
const DUREE_CACHE_MAINTENANCE_MS = 15_000;
let cacheMaintenance: { active: boolean; expireA: number } | null = null;

async function lireMaintenanceActive(supabase: ClientProxy): Promise<boolean> {
  const maintenant = Date.now();
  if (cacheMaintenance && cacheMaintenance.expireA > maintenant) {
    return cacheMaintenance.active;
  }

  const { data, error } = await supabase
    .from("parametres_plateforme")
    .select("maintenance_active")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[proxy] lecture du mode maintenance échouée :", error.message);
    return cacheMaintenance?.active ?? false;
  }

  const active = data?.maintenance_active ?? false;
  cacheMaintenance = { active, expireA: maintenant + DUREE_CACHE_MAINTENANCE_MS };
  return active;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
