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

export type VentesParStatut = Record<
  "paye" | "credit" | "impaye",
  { montant: number; nombre: number }
>;

export async function getVentesParStatut(
  commercantId: string,
  debut: string,
  fin: string,
): Promise<VentesParStatut> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ventes")
    .select("statut, montant_total")
    .eq("commercant_id", commercantId)
    .gte("date_vente", debut)
    .lte("date_vente", fin);

  const resultat: VentesParStatut = {
    paye: { montant: 0, nombre: 0 },
    credit: { montant: 0, nombre: 0 },
    impaye: { montant: 0, nombre: 0 },
  };

  for (const vente of data ?? []) {
    resultat[vente.statut].montant += vente.montant_total;
    resultat[vente.statut].nombre += 1;
  }

  return resultat;
}

// Marge brute : somme de (prix_vente - prix_achat) * quantité, sur les
// ventes payées de la période, liées à un produit du catalogue (une vente
// hors catalogue n'a pas de coût d'achat connu, donc pas de marge calculable).
export async function getMargeBrute(
  commercantId: string,
  debut: string,
  fin: string,
): Promise<number> {
  const supabase = await createClient();
  const { data: ventes } = await supabase
    .from("ventes")
    .select("produit_id, quantite")
    .eq("commercant_id", commercantId)
    .eq("statut", "paye")
    .not("produit_id", "is", null)
    .gte("date_vente", debut)
    .lte("date_vente", fin);

  if (!ventes || ventes.length === 0) return 0;

  const produitIds = [...new Set(ventes.map((vente) => vente.produit_id as string))];
  const { data: produits } = await supabase
    .from("stocks")
    .select("id, prix_achat, prix_vente")
    .in("id", produitIds);

  const margeParProduit = new Map(
    (produits ?? []).map((produit) => [
      produit.id,
      (produit.prix_vente ?? 0) - (produit.prix_achat ?? 0),
    ]),
  );

  return ventes.reduce(
    (somme, vente) =>
      somme + (margeParProduit.get(vente.produit_id as string) ?? 0) * vente.quantite,
    0,
  );
}

export type ApercuGlobal = {
  chiffreAffaires: number;
  totalDepenses: number;
  totalCreancesEnCours: number;
  margeBrute: number;
};

// Totaux "depuis le début" (non bornés dans le temps), à la différence du
// reste du rapport qui respecte la période sélectionnée.
export async function getApercuGlobal(commercantId: string): Promise<ApercuGlobal> {
  const supabase = await createClient();

  const [ventes, depenses, creances] = await Promise.all([
    supabase.from("ventes").select("montant_total").eq("commercant_id", commercantId),
    supabase.from("depenses").select("montant").eq("commercant_id", commercantId),
    supabase
      .from("creances")
      .select("montant, montant_rembourse")
      .eq("commercant_id", commercantId)
      .neq("statut", "soldee"),
  ]);

  const chiffreAffaires = (ventes.data ?? []).reduce(
    (somme, vente) => somme + vente.montant_total,
    0,
  );
  const totalDepenses = (depenses.data ?? []).reduce(
    (somme, depense) => somme + depense.montant,
    0,
  );
  const totalCreancesEnCours = (creances.data ?? []).reduce(
    (somme, creance) => somme + (creance.montant - creance.montant_rembourse),
    0,
  );

  const margeBrute = await getMargeBrute(
    commercantId,
    "1970-01-01",
    new Date().toISOString().slice(0, 10),
  );

  return { chiffreAffaires, totalDepenses, totalCreancesEnCours, margeBrute };
}
