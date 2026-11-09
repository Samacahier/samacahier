"use server";

import { createClient } from "@/lib/supabase/server";
import { lireTout } from "@/lib/utils/lire-tout";

const NOMBRE_MOIS_EVOLUTION = 6;

export type CaMensuel = { mois: string; ca: number };

// CA cumulé de la plateforme (tous commerçants confondus), mois par mois,
// sur les NOMBRE_MOIS_EVOLUTION derniers mois (mois en cours inclus).
export async function getEvolutionCaPlateforme(): Promise<CaMensuel[]> {
  const supabase = await createClient();

  // Agrégé en SQL (migration 20261108140000) : l'ancien calcul additionnait
  // dans Next.js des ventes tronquées à 1000 lignes par l'API.
  const { data, error } = await supabase.rpc("admin_ca_par_mois", {
    p_nombre_mois: NOMBRE_MOIS_EVOLUTION,
  });
  if (error) throw new Error(error.message);

  return (data ?? []).map((ligne) => ({ mois: ligne.mois, ca: Number(ligne.ca) }));
}

export type ComparatifCommercant = {
  commercantId: string;
  nomCommerce: string;
  ca: number;
  nombreVentes: number;
};

export type ComparatifCommercantsPageResult = {
  lignes: ComparatifCommercant[];
  total: number;
};

// Équivalent paginé de getComparatifCommercants : la page de commerçants est
// choisie en base (LIMIT/OFFSET, ordre alphabétique), puis les ventes du
// mois ne sont chargées que pour CES commerçants (.in), pas pour toute la
// plateforme.
export async function getComparatifCommercantsPage(
  page: number,
  pageSize: number,
): Promise<ComparatifCommercantsPageResult> {
  const supabase = await createClient();
  const maintenant = new Date();
  const debut = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
  const fin = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);

  const debutPage = (page - 1) * pageSize;
  const finPage = debutPage + pageSize - 1;

  const {
    data: commercants,
    error,
    count,
  } = await supabase
    .from("commercants")
    .select("id, nom_commerce", { count: "exact" })
    .order("nom_commerce", { ascending: true })
    .range(debutPage, finPage);

  if (error) throw new Error(error.message);
  if (!commercants || commercants.length === 0) return { lignes: [], total: count ?? 0 };

  const idsPage = commercants.map((commercant) => commercant.id);
  const parCommercant = await caParCommercant(debut, fin, idsPage);

  const lignes = commercants.map((commercant) => ({
    commercantId: commercant.id,
    nomCommerce: commercant.nom_commerce,
    ca: parCommercant.get(commercant.id)?.ca ?? 0,
    nombreVentes: parCommercant.get(commercant.id)?.nombreVentes ?? 0,
  }));

  return { lignes, total: count ?? 0 };
}

// CA et nombre de ventes du mois en cours, un commerçant par ligne, pour
// TOUTE la plateforme. Le tableau affiché à l'écran utilise désormais
// getComparatifCommercantsPage (paginée) ; cette version complète ne sert
// plus qu'à l'export CSV, déclenché à la demande depuis ComparatifTable.
export async function getComparatifCommercants(): Promise<ComparatifCommercant[]> {
  const supabase = await createClient();
  const maintenant = new Date();
  const debut = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
  const fin = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() + 1, 1),
  )
    .toISOString()
    .slice(0, 10);

  const [commercants, parCommercant] = await Promise.all([
    lireTout((d, f) =>
      supabase.from("commercants").select("id, nom_commerce").order("id").range(d, f),
    ),
    caParCommercant(debut, fin, null),
  ]);

  return (commercants.data ?? []).map((commercant) => ({
    commercantId: commercant.id,
    nomCommerce: commercant.nom_commerce,
    ca: parCommercant.get(commercant.id)?.ca ?? 0,
    nombreVentes: parCommercant.get(commercant.id)?.nombreVentes ?? 0,
  }));
}

// CA + nombre de ventes par commerçant, agrégés en SQL (fonction
// admin_ca_par_commercant) au lieu d'additionner des ventes tronquées à
// 1000 lignes par l'API.
async function caParCommercant(
  debut: string,
  fin: string,
  commercantIds: string[] | null,
): Promise<Map<string, { ca: number; nombreVentes: number }>> {
  const supabase = await createClient();
  const { data, error } = await lireTout((d, f) =>
    supabase
      .rpc("admin_ca_par_commercant", {
        p_debut: debut,
        p_fin: fin,
        ...(commercantIds ? { p_commercant_ids: commercantIds } : {}),
      })
      .order("commercant_id")
      .range(d, f),
  );
  if (error) throw new Error(error.message);

  return new Map(
    data.map((ligne) => [
      ligne.commercant_id,
      { ca: Number(ligne.ca), nombreVentes: Number(ligne.nombre_ventes) },
    ]),
  );
}
