"use server";

import { createClient } from "@/lib/supabase/server";

const NOMBRE_MOIS_EVOLUTION = 6;

export type CaMensuel = { mois: string; ca: number };

// CA cumulé de la plateforme (tous commerçants confondus), mois par mois,
// sur les NOMBRE_MOIS_EVOLUTION derniers mois (mois en cours inclus).
export async function getEvolutionCaPlateforme(): Promise<CaMensuel[]> {
  const supabase = await createClient();
  const maintenant = new Date();
  const debut = new Date(
    Date.UTC(
      maintenant.getUTCFullYear(),
      maintenant.getUTCMonth() - (NOMBRE_MOIS_EVOLUTION - 1),
      1,
    ),
  )
    .toISOString()
    .slice(0, 10);

  const { data } = await supabase
    .from("ventes")
    .select("montant_total, date_vente")
    .gte("date_vente", debut);

  const parMois = new Map<string, number>();
  for (let i = NOMBRE_MOIS_EVOLUTION - 1; i >= 0; i--) {
    const mois = new Date(
      Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() - i, 1),
    )
      .toISOString()
      .slice(0, 7);
    parMois.set(mois, 0);
  }

  for (const vente of data ?? []) {
    const cle = vente.date_vente.slice(0, 7);
    if (parMois.has(cle)) {
      parMois.set(cle, (parMois.get(cle) ?? 0) + vente.montant_total);
    }
  }

  return Array.from(parMois.entries()).map(([mois, ca]) => ({ mois, ca }));
}

export type ComparatifCommercant = {
  commercantId: string;
  nomCommerce: string;
  ca: number;
  nombreVentes: number;
};

// CA et nombre de ventes du mois en cours, un commerçant par ligne — pour
// le tableau comparatif des rapports plateforme.
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

  const [commercants, ventes] = await Promise.all([
    supabase.from("commercants").select("id, nom_commerce"),
    supabase
      .from("ventes")
      .select("commercant_id, montant_total")
      .gte("date_vente", debut)
      .lt("date_vente", fin),
  ]);

  const parCommercant = new Map<string, { ca: number; nombreVentes: number }>();
  for (const vente of ventes.data ?? []) {
    const entree = parCommercant.get(vente.commercant_id) ?? { ca: 0, nombreVentes: 0 };
    entree.ca += vente.montant_total;
    entree.nombreVentes += 1;
    parCommercant.set(vente.commercant_id, entree);
  }

  return (commercants.data ?? []).map((commercant) => ({
    commercantId: commercant.id,
    nomCommerce: commercant.nom_commerce,
    ca: parCommercant.get(commercant.id)?.ca ?? 0,
    nombreVentes: parCommercant.get(commercant.id)?.nombreVentes ?? 0,
  }));
}
