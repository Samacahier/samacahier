"use server";

import { createClient } from "@/lib/supabase/server";

export type RapportPeriode = {
  totalVentes: number;
  totalDepenses: number;
  soldeCaisse: number;
  totalCreancesEnCours: number;
};

// `debut`/`fin` sont des dates (YYYY-MM-DD) incluses côté utilisateur. Pour
// les colonnes timestamptz (caisse, creances), on borne à `fin` + 1 jour afin
// de couvrir toute la journée de fin.
function lendemain(date: string): string {
  const jour = new Date(`${date}T00:00:00Z`);
  jour.setUTCDate(jour.getUTCDate() + 1);
  return jour.toISOString().slice(0, 10);
}

export async function getRapportPeriode(
  commercantId: string,
  debut: string,
  fin: string,
): Promise<RapportPeriode> {
  const supabase = await createClient();
  const finLendemain = lendemain(fin);

  const [ventes, depenses, caisse, creances] = await Promise.all([
    supabase
      .from("ventes")
      .select("montant_total")
      .eq("commercant_id", commercantId)
      .gte("date_vente", debut)
      .lte("date_vente", fin),
    supabase
      .from("depenses")
      .select("montant")
      .eq("commercant_id", commercantId)
      .gte("date_depense", debut)
      .lte("date_depense", fin),
    supabase
      .from("caisse")
      .select("type_mouvement, montant")
      .eq("commercant_id", commercantId)
      .gte("date_mouvement", debut)
      .lt("date_mouvement", finLendemain),
    supabase
      .from("creances")
      .select("montant, montant_rembourse")
      .eq("commercant_id", commercantId)
      .neq("statut", "soldee")
      .gte("created_at", debut)
      .lt("created_at", finLendemain),
  ]);

  const totalVentes = (ventes.data ?? []).reduce(
    (somme, vente) => somme + vente.montant_total,
    0,
  );

  const totalDepenses = (depenses.data ?? []).reduce(
    (somme, depense) => somme + depense.montant,
    0,
  );

  const soldeCaisse = (caisse.data ?? []).reduce(
    (solde, mouvement) =>
      solde + (mouvement.type_mouvement === "entree" ? mouvement.montant : -mouvement.montant),
    0,
  );

  const totalCreancesEnCours = (creances.data ?? []).reduce(
    (somme, creance) => somme + (creance.montant - creance.montant_rembourse),
    0,
  );

  return { totalVentes, totalDepenses, soldeCaisse, totalCreancesEnCours };
}
