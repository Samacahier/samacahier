"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Vente } from "@/types/database";
import { messageErreur } from "@/lib/utils/erreurs";

type VenteInsert = Database["public"]["Tables"]["ventes"]["Insert"];
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;
type ProduitVendu = { produit_id: string | null; quantite: number };

export type VenteFormInput = Omit<
  VenteInsert,
  "id" | "commercant_id" | "created_at"
>;

export type VentesPage = { ventes: Vente[]; total: number };

// Liste paginée côté base (page de `taille` lignes, la plus récente d'abord).
// Remplace le chargement de toute la liste : plus rapide sur mobile, et plus
// de troncature silencieuse à 1000 lignes.
export async function listVentesPage(
  commercantId: string,
  page: number,
  taille: number,
): Promise<VentesPage> {
  const supabase = await createClient();
  const debut = (page - 1) * taille;

  const { data, error, count } = await supabase
    .from("ventes")
    .select("*", { count: "exact" })
    .eq("commercant_id", commercantId)
    .order("date_vente", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .range(debut, debut + taille - 1);

  if (error) throw new Error(error.message);
  return { ventes: data ?? [], total: count ?? 0 };
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
async function syncCreanceForVente(supabase: SupabaseServerClient, vente: Vente): Promise<string | null> {
  const { data: existante } = await supabase
    .from("creances")
    .select("id")
    .eq("vente_id", vente.id)
    .maybeSingle();

  const doitAvoirCreance =
    vente.client_id !== null && (vente.statut === "credit" || vente.statut === "impaye");

  if (!doitAvoirCreance) {
    if (existante) {
      const { error } = await supabase.from("creances").update({ statut: "soldee" }).eq("id", existante.id);
      if (error) return error.message;
    }
    return null;
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

  const { error } = existante
    ? await supabase.from("creances").update(payload).eq("id", existante.id)
    : await supabase.from("creances").insert(payload);
  return error ? error.message : null;
}

// Le montant réellement encaissé sur une vente alimente automatiquement une
// entrée dans Ma Caisse. Pas d'entrée si rien n'a été encaissé (impayé).
async function syncCaisseForVente(supabase: SupabaseServerClient, vente: Vente): Promise<string | null> {
  const { data: existante } = await supabase
    .from("caisse")
    .select("id")
    .eq("vente_id", vente.id)
    .maybeSingle();

  const montantEncaisse = vente.montant_encaisse ?? 0;

  if (montantEncaisse <= 0) {
    if (existante) {
      const { error } = await supabase.from("caisse").delete().eq("id", existante.id);
      if (error) return error.message;
    }
    return null;
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

  const { error } = existante
    ? await supabase.from("caisse").update(payload).eq("id", existante.id)
    : await supabase.from("caisse").insert(payload);
  return error ? error.message : null;
}

// Applique un delta de quantité sur un produit du catalogue. Le stock peut
// devenir négatif (aucun blocage) : l'alerte de seuil existante suffit.
//
// Atomique : la fonction SQL fait `quantite = quantite + delta` en une seule
// instruction. L'ancienne version (lire la quantité, puis écrire lue + delta)
// perdait une déduction quand deux ventes du même produit arrivaient en même
// temps — cause des écarts de stock signalés "parfois".
async function ajusterQuantiteStock(
  supabase: SupabaseServerClient,
  produitId: string,
  delta: number,
) {
  if (delta === 0) return;

  const { error } = await supabase.rpc("ajuster_stock_quantite", {
    p_produit_id: produitId,
    p_delta: delta,
  });

  if (error) {
    console.error(
      `[stocks] ajustement de ${delta} sur le produit ${produitId} échoué :`,
      error.message,
    );
  }
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

export async function createVente(
  input: VenteFormInput,
): Promise<{ error: string | null; vente?: Vente }> {
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

  if (error) return { error: messageErreur(error, "ventes") };

  const erreurSync =
    (await syncCreanceForVente(supabase, vente)) ?? (await syncCaisseForVente(supabase, vente));
  await syncStockForVente(supabase, null, vente);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  if (erreurSync) {
    // Avant, ces erreurs étaient ignorées en silence. Elles sont désormais
    // journalisées (Vercel → Logs, "[ventes]"). On ne renvoie pas d'erreur
    // au formulaire : la vente est déjà enregistrée, et un message d'échec
    // pousserait le commerçant à la ressaisir (doublon).
    console.error(`[ventes] vente ${vente.id} : synchronisation caisse/créance échouée :`, erreurSync);
  }
  return { error: null, vente };
}

export async function updateVente(
  id: string,
  input: Partial<VenteFormInput>,
): Promise<{ error: string | null; vente?: Vente }> {
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

  if (error) return { error: messageErreur(error, "ventes") };

  const erreurSync =
    (await syncCreanceForVente(supabase, vente)) ?? (await syncCaisseForVente(supabase, vente));
  await syncStockForVente(supabase, avant, vente);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  if (erreurSync) {
    // Avant, ces erreurs étaient ignorées en silence. Elles sont désormais
    // journalisées (Vercel → Logs, "[ventes]"). On ne renvoie pas d'erreur
    // au formulaire : la vente est déjà enregistrée, et un message d'échec
    // pousserait le commerçant à la ressaisir (doublon).
    console.error(`[ventes] vente ${vente.id} : synchronisation caisse/créance échouée :`, erreurSync);
  }
  return { error: null, vente };
}

export async function deleteVente(id: string) {
  const supabase = await createClient();

  const { data: vente, error } = await supabase
    .from("ventes")
    .delete()
    .eq("id", id)
    .select("produit_id, quantite")
    .single();

  if (error) return { error: messageErreur(error, "ventes") };

  await syncStockForVente(supabase, vente, null);

  revalidatePath("/ventes");
  revalidatePath("/caisse");
  revalidatePath("/stocks");
  return { error: null };
}
