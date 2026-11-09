"use server";

import { createClient } from "@/lib/supabase/server";
import type { Commercant } from "@/types/database";

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

export type AdminKpis = {
  totalCommercants: number;
  commercantsActifs: number;
  caCumuleMois: number;
  nouveauxInscrits7j: number;
  inactifs14j: number;
  inscriptionsParJour: { date: string; count: number }[];
};

// KPIs de la Vue d'ensemble, agrégés par Postgres (fonction SQL admin_kpis,
// migration 20261108120000). Remplace l'ancien calcul en mémoire à partir de
// listes complètes, tronquées à 1000 lignes par l'API Supabase : c'est ce
// qui bloquait "Commerçants actifs" à 1000 et faussait le CA du mois et le
// nombre d'inactifs. Un commerçant est inactif s'il n'a ni vente, ni dépense,
// ni mouvement de caisse depuis 14 jours (date d'inscription à défaut).
export async function getAdminKpis(): Promise<AdminKpis> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_kpis");

  if (error) throw new Error(error.message);

  return {
    totalCommercants: Number(data.total_commercants),
    commercantsActifs: Number(data.commercants_actifs),
    caCumuleMois: Number(data.ca_cumule_mois),
    nouveauxInscrits7j: Number(data.nouveaux_inscrits_7j),
    inactifs14j: Number(data.inactifs_14j),
    inscriptionsParJour: (data.inscriptions_par_jour ?? []).map((jour) => ({
      date: jour.date,
      count: Number(jour.count),
    })),
  };
}

// Top commerçants par CA du mois : tri + limite faits en base via la vue
// admin_commercants_overview (au lieu de trier une liste tronquée à 1000).
export async function listTopCommercants(nombre: number): Promise<CommercantOverview[]> {
  const { overviews } = await listCommercantsOverviewPage({
    page: 1,
    pageSize: nombre,
    tri: "ca",
  });
  return overviews;
}
