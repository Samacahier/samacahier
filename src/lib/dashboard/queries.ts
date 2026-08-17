"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  chiffreAffaires: number;
  totalVentesNombre: number;
  encaissements: number;
  totalDepenses: number;
  totalCreancesEnCours: number;
  soldeCaisse: number;
  soldePoche: number;
  produitsEnAlerte: { id: string; nomArticle: string }[];
};

export type OperationRecente = {
  id: string;
  type: "vente" | "depense";
  description: string;
  montant: number;
  date: string;
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

// CA, encaissements et dépenses sont bornés au mois en cours. Le solde des
// poches, les créances en cours et les alertes de stock sont des états
// courants, non bornés dans le temps.
export async function getDashboardStats(commercantId: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const { debut, fin } = bornesMoisEnCours();

  const [ventes, depenses, caisse, creances, stocks, commercant] = await Promise.all([
    supabase
      .from("ventes")
      .select("montant_total, montant_encaisse")
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
      .select("type_mouvement, montant, type_poche")
      .eq("commercant_id", commercantId),
    supabase
      .from("creances")
      .select("montant, montant_rembourse")
      .eq("commercant_id", commercantId)
      .neq("statut", "soldee"),
    supabase
      .from("stocks")
      .select("id, nom_article, quantite, seuil_alerte")
      .eq("commercant_id", commercantId),
    supabase
      .from("commercants")
      .select("solde_initial_caisse, solde_initial_poche")
      .eq("id", commercantId)
      .single(),
  ]);

  const chiffreAffaires = (ventes.data ?? []).reduce(
    (somme, vente) => somme + vente.montant_total,
    0,
  );
  const totalVentesNombre = ventes.data?.length ?? 0;
  const encaissements = (ventes.data ?? []).reduce(
    (somme, vente) => somme + (vente.montant_encaisse ?? 0),
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

  const produitsEnAlerte = (stocks.data ?? [])
    .filter((stock) => stock.quantite <= stock.seuil_alerte)
    .map((stock) => ({ id: stock.id, nomArticle: stock.nom_article }));

  const mouvementsPoche = (poche: "caisse" | "poche") =>
    (caisse.data ?? []).filter((mouvement) => mouvement.type_poche === poche);

  const soldeDune = (poche: "caisse" | "poche", initial: number) =>
    initial +
    mouvementsPoche(poche).reduce(
      (solde, m) => solde + (m.type_mouvement === "entree" ? m.montant : -m.montant),
      0,
    );

  const soldeCaisse = soldeDune("caisse", commercant.data?.solde_initial_caisse ?? 0);
  const soldePoche = soldeDune("poche", commercant.data?.solde_initial_poche ?? 0);

  return {
    chiffreAffaires,
    totalVentesNombre,
    encaissements,
    totalDepenses,
    totalCreancesEnCours,
    soldeCaisse,
    soldePoche,
    produitsEnAlerte,
  };
}

// Dernier flux d'opérations (ventes + dépenses confondues), pour la section
// "Dernières opérations" de l'accueil.
export async function getDernieresOperations(
  commercantId: string,
  limite: number,
): Promise<OperationRecente[]> {
  const supabase = await createClient();

  const [ventes, depenses] = await Promise.all([
    supabase
      .from("ventes")
      .select("id, description, montant_total, date_vente")
      .eq("commercant_id", commercantId)
      .order("date_vente", { ascending: false })
      .limit(limite),
    supabase
      .from("depenses")
      .select("id, libelle, montant, date_depense")
      .eq("commercant_id", commercantId)
      .order("date_depense", { ascending: false })
      .limit(limite),
  ]);

  const operations: OperationRecente[] = [
    ...(ventes.data ?? []).map((vente) => ({
      id: vente.id,
      type: "vente" as const,
      description: vente.description,
      montant: vente.montant_total,
      date: vente.date_vente,
    })),
    ...(depenses.data ?? []).map((depense) => ({
      id: depense.id,
      type: "depense" as const,
      description: depense.libelle,
      montant: depense.montant,
      date: depense.date_depense,
    })),
  ];

  return operations
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limite);
}
