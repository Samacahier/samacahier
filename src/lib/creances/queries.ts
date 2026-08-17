"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Creance } from "@/types/database";

type CreanceInsert = Database["public"]["Tables"]["creances"]["Insert"];

export type CreanceFormInput = Omit<
  CreanceInsert,
  "id" | "commercant_id" | "created_at"
>;

export async function listCreances(commercantId: string): Promise<Creance[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("creances")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCreance(input: CreanceFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("creances")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/creances");
  return { error: null };
}

export async function updateCreance(id: string, input: Partial<CreanceFormInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("creances").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/creances");
  return { error: null };
}

export async function deleteCreance(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("creances").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/creances");
  return { error: null };
}
