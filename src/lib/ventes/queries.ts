"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Vente } from "@/types/database";

type VenteInsert = Database["public"]["Tables"]["ventes"]["Insert"];
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type ProduitVendu = { produit_id: string | null; quantite: number };

export type VenteFormInput = Omit<
  VenteInsert,
  "id" | "commercant_id" | "created_at"
>;

export async function listVentes(commercantId: string): Promise<Vente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ventes")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("date_vente", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getVenteById(id: string): Promise<Vente | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ventes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

// Une vente à crédit/impayée avec un client réel doit avoir une créance liée
// (créée ou mise à jour). Si ce n'est plus le cas (repassée payée, ou client
// comptant), la créance existante est soldée plutôt que supprimée.
async function syncCreanceForVente(supabase: SupabaseServerClient, vente: Vente) {
  const { data: existante } = await supabase
    .from("creances")
    .select("id")
    .eq("vente_id", vente.id)
    .maybeSingle();

  const doitAvoirCreance =
    vente.client_id !== null && (vente.statut === "credit" || vente.statut === "impaye");

  if (!doitAvoirCreance) {
    if (existante) {
      await supabase.from("creances").update({ statut: "soldee" }).eq("id", existante.id);
    }
    return;
  }

  const { data: client } = await supabase
    .from("clients")
    .select("nom, telephone")
    .eq("id", vente.client_id as string)
    .single();

  const payload = {
    commercant_id: vente.commercant_id,
    client_id: vente.client_id,
    client_nom: client?.nom ?? "",
    client_telephone: client?.telephone ?? null,
    montant: vente.montant_total,
    montant_rembourse: vente.montant_encaisse ?? 0,
    vente_id: vente.id,
  };

  if (existante) {
    await supabase.from("creances").update(payload).eq("id", existante.id);
  } else {
    await supabase.from("creances").insert(payload);
  }
}

// Le montant réellement encaissé sur une vente alimente automatiquement une
// entrée dans Ma Caisse. Pas d'entrée si rien n'a été encaissé (impayé).
async function syncCaisseForVente(supabase: SupabaseServerClient, vente: Vente) {
  const { data: existante } = await supabase
    .from("caisse")
    .select("id")
    .eq("vente_id", vente.id)
    .maybeSingle();

  const montantEncaisse = vente.montant_encaisse ?? 0;

  if (montantEncaisse <= 0) {
    if (existante) await supabase.from("caisse").delete().eq("id", existante.id);
    return;
  }

  const payload = {
    commercant_id: vente.commercant_id,
    type_mouvement: "entree" as const,
    type_poche: "caisse" as const,
    montant: montantEncaisse,
    motif: `Vente — ${vente.description}`,
    date_mouvement: vente.date_vente,
    vente_id: vente.id,
  };

  if (existante) {
    await supabase.from("caisse").update(payload).eq("id", existante.id);
  } else {
    await supabase.from("caisse").insert(payload);
  }
}

// Applique un delta de quantité sur un produit du catalogue. Le stock peut
// devenir négatif (aucun blocage) : l'alerte de seuil existante suffit.
async function ajusterQuantiteStock(
  supabase: SupabaseServerClient,
  produitId: string,
  delta: number,
) {
  const { data: produit } = await supabase
    .from("stocks")
    .select("quantite")
    .eq("id", produitId)
    .single();

  if (!produit) return;

  await supabase
    .from("stocks")
    .update({
      quantite: produit.quantite + delta,
      updated_at: new Date().toISOString(),
    })
    .eq("id", produitId);
}

// Une vente liée à un produit du catalogue déduit sa quantité du stock. Pas
// de déduction pour une vente hors catalogue (produit_id nul). `avant` est
// l'état précédent de la vente (null à la création) : sa quantité est
// remise en stock avant d'appliquer la nouvelle déduction, pour que les
// éditions successives (changement de produit ou de quantité) restent
// justes sans double comptage.
async function syncStockForVente(
  supabase: SupabaseServerClient,
  avant: ProduitVendu | null,
  apres: ProduitVendu | null,
) {
  if (avant?.produit_id) {
    await ajusterQuantiteStock(supabase, avant.produit_id, avant.quantite);
  }
  if (apres?.produit_id) {
    await ajusterQuantiteStock(supabase, apres.produit_id, -apres.quantite);
  }
}

export async function createVente(input: VenteFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { data: vente, error } = await supabase
    .from("ventes")
    .insert({ ...input, commercant_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message };

  await syncCreanceForVente(supabase, vente);
  await syncCaisseForVente(supabase, vente);
  await syncStockForVente(supabase, null, vente);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  return { error: null };
}

export async function updateVente(id: string, input: Partial<VenteFormInput>) {
  const supabase = await createClient();

  const { data: avant } = await supabase
    .from("ventes")
    .select("produit_id, quantite")
    .eq("id", id)
    .single();

  const { data: vente, error } = await supabase
    .from("ventes")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  await syncCreanceForVente(supabase, vente);
  await syncCaisseForVente(supabase, vente);
  await syncStockForVente(supabase, avant, vente);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  return { error: null };
}

export async function deleteVente(id: string) {
  const supabase = await createClient();

  const { data: vente, error } = await supabase
    .from("ventes")
    .delete()
    .eq("id", id)
    .select("produit_id, quantite")
    .single();

  if (error) return { error: error.message };

  await syncStockForVente(supabase, vente, null);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  return { error: null };
}
