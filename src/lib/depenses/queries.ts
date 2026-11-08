"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Depense } from "@/types/database";
import { messageErreur } from "@/lib/utils/erreurs";

type DepenseInsert = Database["public"]["Tables"]["depenses"]["Insert"];
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type DepenseFormInput = Omit<
  DepenseInsert,
  "id" | "commercant_id" | "created_at"
>;

export type DepensesPage = { depenses: Depense[]; total: number };

// Liste paginée côté base (page de `taille` lignes, la plus récente d'abord).
// Remplace le chargement de toute la liste : plus rapide sur mobile, et plus
// de troncature silencieuse à 1000 lignes.
export async function listDepensesPage(
  commercantId: string,
  page: number,
  taille: number,
): Promise<DepensesPage> {
  const supabase = await createClient();
  const debut = (page - 1) * taille;

  const { data, error, count } = await supabase
    .from("depenses")
    .select("*", { count: "exact" })
    .eq("commercant_id", commercantId)
    .order("date_depense", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id")
    .range(debut, debut + taille - 1);

  if (error) throw new Error(error.message);
  return { depenses: data ?? [], total: count ?? 0 };
}

// Chaque dépense enregistrée débite automatiquement la poche choisie
// (source) dans Trésorerie, via une sortie de caisse liée.
async function syncCaisseForDepense(supabase: SupabaseServerClient, depense: Depense) {
  const { data: existante } = await supabase
    .from("caisse")
    .select("id")
    .eq("depense_id", depense.id)
    .maybeSingle();

  const payload = {
    commercant_id: depense.commercant_id,
    type_mouvement: "sortie" as const,
    type_poche: depense.source,
    montant: depense.montant,
    motif: `Dépense — ${depense.libelle}`,
    date_mouvement: depense.date_depense,
    depense_id: depense.id,
  };

  if (existante) {
    await supabase.from("caisse").update(payload).eq("id", existante.id);
  } else {
    await supabase.from("caisse").insert(payload);
  }
}

export async function createDepense(input: DepenseFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { data: depense, error } = await supabase
    .from("depenses")
    .insert({ ...input, commercant_id: user.id })
    .select()
    .single();

  if (error) return { error: messageErreur(error, "depenses") };

  await syncCaisseForDepense(supabase, depense);

  revalidatePath("/depenses");
  revalidatePath("/caisse");
  return { error: null };
}

export async function updateDepense(id: string, input: Partial<DepenseFormInput>) {
  const supabase = await createClient();
  const { data: depense, error } = await supabase
    .from("depenses")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: messageErreur(error, "depenses") };

  await syncCaisseForDepense(supabase, depense);

  revalidatePath("/depenses");
  revalidatePath("/caisse");
  return { error: null };
}

export async function deleteDepense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("depenses").delete().eq("id", id);

  if (error) return { error: messageErreur(error, "depenses") };

  revalidatePath("/depenses");
  revalidatePath("/caisse");
  return { error: null };
}
