"use server";

import { createClient } from "@/lib/supabase/server";
import type { Commercant } from "@/types/database";

// Un commerçant sans vente/dépense/mouvement de caisse depuis ce seuil est
// considéré inactif dans la vue d'ensemble admin.
const SEUIL_INACTIVITE_JOURS = 14;
const JOURS_GRAPHIQUE_INSCRIPTIONS = 30;

export type CommercantOverview = {
  commercant: Commercant;
  chiffreAffaires: number;
  soldeCaisse: number;
  derniereActivite: string | null;
};

export type CommercantsFiltre = "tous" | "actifs" | "desactives";
export type CommercantsTri = "recent" | "ca" | "activite";

export type CommercantsPageParams = {
  page: number;
  pageSize: number;
  recherche?: string;
  filtre?: CommercantsFiltre;
  tri?: CommercantsTri;
};

export type CommercantsPageResult = {
  overviews: CommercantOverview[];
  total: number;
};

const COLONNE_TRI: Record<CommercantsTri, string> = {
  recent: "created_at",
  ca: "chiffre_affaires",
  activite: "derniere_activite",
};

// Équivalent paginé de listCommercantsOverview, pour la liste /admin/dashboard
// ("Commerçants") : filtre, tri et pagination sont appliqués côté base de
// données via la vue admin_commercants_overview (chiffre_affaires,
// solde_caisse et derniere_activite y sont déjà calculés par commerçant),
// donc la requête ne ramène jamais que la page demandée — pas la liste
// complète découpée ensuite en mémoire.
export async function listCommercantsOverviewPage(
  params: CommercantsPageParams,
): Promise<CommercantsPageResult> {
  const supabase = await createClient();
  const { page, pageSize, recherche, filtre = "tous", tri = "recent" } = params;

  let requete = supabase.from("admin_commercants_overview").select("*", { count: "exact" });

  if (filtre === "actifs") requete = requete.eq("actif", true);
  if (filtre === "desactives") requete = requete.eq("actif", false);

  const termeRecherche = recherche?.trim().replace(/[,()]/g, "");
  if (termeRecherche) {
    requete = requete.or(
      `nom_commerce.ilike.*${termeRecherche}*,activite.ilike.*${termeRecherche}*`,
    );
  }

  const debut = (page - 1) * pageSize;
  const fin = debut + pageSize - 1;

  const { data, error, count } = await requete
    .order(COLONNE_TRI[tri], { ascending: false, nullsFirst: false })
    .range(debut, fin);

  if (error) throw new Error(error.message);

  const overviews: CommercantOverview[] = (data ?? []).map((ligne) => {
    const { chiffre_affaires, solde_caisse, derniere_activite, ...commercant } = ligne;
    return {
      commercant,
      chiffreAffaires: chiffre_affaires ?? 0,
      soldeCaisse: solde_caisse ?? 0,
      derniereActivite: derniere_activite,
    };
  });

  return { overviews, total: count ?? 0 };
}

// Bornes [début, fin) du mois en cours, au format date ISO (YYYY-MM-DD).
function bornesMoisEnCours() {
  const maintenant = new Date();
  const debut = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1),
  )
    .toISOString()
    .slice(0, 10);
  const fin = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);
  return { debut, fin };
}

// Dernière activité (vente, dépense ou mouvement de caisse) de chaque
// commerçant, en 3 requêtes agrégées (une par table) au lieu d'une requête
// par commerçant : chaque table est déjà triée par date décroissante, donc
// la première ligne rencontrée pour un commerçant donné est sa plus récente.
async function getDernieresActivitesParCommercant(): Promise<Map<string, string>> {
  const supabase = await createClient();

  const [ventes, depenses, caisse] = await Promise.all([
    supabase
      .from("ventes")
      .select("commercant_id, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("depenses")
      .select("commercant_id, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("caisse")
      .select("commercant_id, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const dernieres = new Map<string, string>();
  for (const lignes of [ventes.data, depenses.data, caisse.data]) {
    for (const ligne of lignes ?? []) {
      const actuelle = dernieres.get(ligne.commercant_id);
      if (!actuelle || ligne.created_at > actuelle) {
        dernieres.set(ligne.commercant_id, ligne.created_at);
      }
    }
  }
  return dernieres;
}

// Liste tous les commerçants (accessible uniquement à l'admin via RLS) avec
// leurs indicateurs clés. Chaque indicateur est calculé à partir de requêtes
// agrégées sur l'ensemble des commerçants (nombre de requêtes constant),
// plutôt que d'une requête par commerçant (pattern N+1 précédemment en place
// via getDashboardStats/getDerniereActivite, responsable de la lenteur
// perçue au chargement de la Vue d'ensemble et de la liste Commerçants).
export async function listCommercantsOverview(): Promise<CommercantOverview[]> {
  const supabase = await createClient();
  const { data: commercants, error } = await supabase
    .from("commercants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!commercants || commercants.length === 0) return [];

  const { debut, fin } = bornesMoisEnCours();

  const [ventesMois, caisse, dernieresActivites] = await Promise.all([
    supabase
      .from("ventes")
      .select("commercant_id, montant_total")
      .gte("date_vente", debut)
      .lt("date_vente", fin),
    supabase.from("caisse").select("commercant_id, type_mouvement, montant, type_poche"),
    getDernieresActivitesParCommercant(),
  ]);

  const caParCommercant = new Map<string, number>();
  for (const vente of ventesMois.data ?? []) {
    caParCommercant.set(
      vente.commercant_id,
      (caParCommercant.get(vente.commercant_id) ?? 0) + vente.montant_total,
    );
  }

  const mouvementsParCommercant = new Map<string, NonNullable<typeof caisse.data>>();
  for (const mouvement of caisse.data ?? []) {
    const liste = mouvementsParCommercant.get(mouvement.commercant_id) ?? [];
    liste.push(mouvement);
    mouvementsParCommercant.set(mouvement.commercant_id, liste);
  }

  return commercants.map((commercant) => {
    const mouvements = mouvementsParCommercant.get(commercant.id) ?? [];
    const soldeDune = (poche: "caisse" | "poche", initial: number) =>
      initial +
      mouvements
        .filter((m) => m.type_poche === poche)
        .reduce((solde, m) => solde + (m.type_mouvement === "entree" ? m.montant : -m.montant), 0);

    return {
      commercant,
      chiffreAffaires: caParCommercant.get(commercant.id) ?? 0,
      // Solde combiné (Ma Caisse + Ma Poche) : équivalent au solde de
      // caisse global affiché avant l'introduction des deux poches.
      soldeCaisse:
        soldeDune("caisse", commercant.solde_initial_caisse ?? 0) +
        soldeDune("poche", commercant.solde_initial_poche ?? 0),
      derniereActivite: dernieresActivites.get(commercant.id) ?? null,
    };
  });
}

export type AdminKpis = {
  commercantsActifs: number;
  caCumuleMois: number;
  nouveauxInscrits7j: number;
  inactifs14j: number;
  inscriptionsParJour: { date: string; count: number }[];
};

async function getCaCumuleMoisPlateforme(): Promise<number> {
  const supabase = await createClient();
  const { debut, fin } = bornesMoisEnCours();

  const { data } = await supabase
    .from("ventes")
    .select("montant_total")
    .gte("date_vente", debut)
    .lt("date_vente", fin);

  return (data ?? []).reduce((somme, vente) => somme + vente.montant_total, 0);
}

// KPIs de pilotage de la plateforme, dérivés de la liste des commerçants
// déjà chargée (évite de re-requêter) sauf pour le CA cumulé, agrégé en une
// seule requête tous commerçants confondus.
export async function getAdminKpis(overviews: CommercantOverview[]): Promise<AdminKpis> {
  const maintenant = Date.now();
  const joursDepuis = (date: string) =>
    (maintenant - new Date(date).getTime()) / (1000 * 60 * 60 * 24);

  const commercantsActifs = overviews.filter((o) => o.commercant.actif).length;

  const nouveauxInscrits7j = overviews.filter(
    (o) => joursDepuis(o.commercant.created_at) <= 7,
  ).length;

  const inactifs14j = overviews.filter((o) => {
    const reference = o.derniereActivite ?? o.commercant.created_at;
    return joursDepuis(reference) > SEUIL_INACTIVITE_JOURS;
  }).length;

  const compteParJour = new Map<string, number>();
  for (let i = 0; i < JOURS_GRAPHIQUE_INSCRIPTIONS; i++) {
    const jour = new Date(maintenant - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    compteParJour.set(jour, 0);
  }
  for (const { commercant } of overviews) {
    const jour = commercant.created_at.slice(0, 10);
    if (compteParJour.has(jour)) {
      compteParJour.set(jour, (compteParJour.get(jour) ?? 0) + 1);
    }
  }
  const inscriptionsParJour = Array.from(compteParJour.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    commercantsActifs,
    caCumuleMois: await getCaCumuleMoisPlateforme(),
    nouveauxInscrits7j,
    inactifs14j,
    inscriptionsParJour,
  };
}
