"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalVentesMontant: number;
  totalVentesNombre: number;
  totalDepenses: number;
  soldeCaisse: number;
  totalCreancesEnCours: number;
  articlesEnAlerte: number;
};

// Bornes [début, fin) du mois en cours, au format date ISO (YYYY-MM-DD).
function bornesMoisEnCours() {
  const maintenant = new Date();
  const debut = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1),
  );
  const fin = new Date(
    Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth() + 1, 1),
  );
  return { debut: debut.toISOString().slice(0, 10), fin: fin.toISOString().slice(0, 10) };
}

// Ventes et dépenses sont bornées au mois en cours. Le solde de caisse, les
// créances en cours et les alertes de stock sont des états courants, non
// bornés dans le temps.
export async function getDashboardStats(commercantId: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const { debut, fin } = bornesMoisEnCours();

  const [ventes, depenses, caisse, creances, stocks] = await Promise.all([
    supabase
      .from("ventes")
      .select("montant_total")
      .eq("commercant_id", commercantId)
      .gte("date_vente", debut)
      .lt("date_vente", fin),
    supabase
      .from("depenses")
      .select("montant")
      .eq("commercant_id", commercantId)
      .gte("date_depense", debut)
      .lt("date_depense", fin),
    supabase
      .from("caisse")
      .select("type_mouvement, montant")
      .eq("commercant_id", commercantId),
    supabase
      .from("creances")
      .select("montant, montant_rembourse")
      .eq("commercant_id", commercantId)
      .neq("statut", "soldee"),
    supabase
      .from("stocks")
      .select("quantite, seuil_alerte")
      .eq("commercant_id", commercantId),
  ]);

  const totalVentesMontant = (ventes.data ?? []).reduce(
    (somme, vente) => somme + vente.montant_total,
    0,
  );
  const totalVentesNombre = ventes.data?.length ?? 0;

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

  const articlesEnAlerte = (stocks.data ?? []).filter(
    (stock) => stock.quantite <= stock.seuil_alerte,
  ).length;

  return {
    totalVentesMontant,
    totalVentesNombre,
    totalDepenses,
    soldeCaisse,
    totalCreancesEnCours,
    articlesEnAlerte,
  };
}
