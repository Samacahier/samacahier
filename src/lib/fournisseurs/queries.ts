"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Fournisseur } from "@/types/database";

type FournisseurInsert = Database["public"]["Tables"]["fournisseurs"]["Insert"];

export type FournisseurFormInput = Omit<
  FournisseurInsert,
  "id" | "commercant_id" | "created_at"
>;

export async function listFournisseurs(commercantId: string): Promise<Fournisseur[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fournisseurs")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("nom", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createFournisseur(input: FournisseurFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("fournisseurs")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/fournisseurs");
  return { error: null };
}

export async function updateFournisseur(
  id: string,
  input: Partial<FournisseurFormInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("fournisseurs").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/fournisseurs");
  return { error: null };
}

export async function deleteFournisseur(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("fournisseurs").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/fournisseurs");
  return { error: null };
}
