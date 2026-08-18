"use server";

import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/dashboard/queries";
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

async function getDerniereActivite(commercantId: string): Promise<string | null> {
  const supabase = await createClient();

  const [ventes, depenses, caisse] = await Promise.all([
    supabase
      .from("ventes")
      .select("created_at")
      .eq("commercant_id", commercantId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("depenses")
      .select("created_at")
      .eq("commercant_id", commercantId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("caisse")
      .select("created_at")
      .eq("commercant_id", commercantId)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const dates = [ventes.data?.[0], depenses.data?.[0], caisse.data?.[0]]
    .map((ligne) => ligne?.created_at)
    .filter((date): date is string => Boolean(date));

  if (dates.length === 0) return null;
  return dates.sort().at(-1) ?? null;
}

// Liste tous les commerçants (accessible uniquement à l'admin via RLS) avec
// leurs indicateurs clés, calculés via la même logique que le dashboard
// commerçant (getDashboardStats), grâce à public.is_admin() dans les policies.
export async function listCommercantsOverview(): Promise<CommercantOverview[]> {
  const supabase = await createClient();
  const { data: commercants, error } = await supabase
    .from("commercants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return Promise.all(
    (commercants ?? []).map(async (commercant) => {
      const [stats, derniereActivite] = await Promise.all([
        getDashboardStats(commercant.id),
        getDerniereActivite(commercant.id),
      ]);
      return {
        commercant,
        chiffreAffaires: stats.chiffreAffaires,
        // Solde combiné (Ma Caisse + Ma Poche) : équivalent au solde de
        // caisse global affiché avant l'introduction des deux poches.
        soldeCaisse: stats.soldeCaisse + stats.soldePoche,
        derniereActivite,
      };
    }),
  );
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
