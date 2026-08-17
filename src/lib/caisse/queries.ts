"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Caisse } from "@/types/database";

type CaisseInsert = Database["public"]["Tables"]["caisse"]["Insert"];

export type CaisseFormInput = Omit<
  CaisseInsert,
  "id" | "commercant_id" | "created_at"
>;

export async function listCaisse(commercantId: string): Promise<Caisse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("caisse")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("date_mouvement", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createMouvement(input: CaisseFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("caisse")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/caisse");
  return { error: null };
}

export async function updateMouvement(id: string, input: Partial<CaisseFormInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("caisse").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/caisse");
  return { error: null };
}

export async function deleteMouvement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("caisse").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/caisse");
  return { error: null };
}
