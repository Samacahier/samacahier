"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Vente } from "@/types/database";

type VenteInsert = Database["public"]["Tables"]["ventes"]["Insert"];

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

export async function createVente(input: VenteFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("ventes")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/ventes");
  return { error: null };
}

export async function updateVente(id: string, input: Partial<VenteFormInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("ventes").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/ventes");
  return { error: null };
}

export async function deleteVente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ventes").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/ventes");
  return { error: null };
}
