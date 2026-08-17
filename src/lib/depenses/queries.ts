"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Depense } from "@/types/database";

type DepenseInsert = Database["public"]["Tables"]["depenses"]["Insert"];

export type DepenseFormInput = Omit<
  DepenseInsert,
  "id" | "commercant_id" | "created_at"
>;

export async function listDepenses(commercantId: string): Promise<Depense[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("depenses")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("date_depense", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createDepense(input: DepenseFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("depenses")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/depenses");
  return { error: null };
}

export async function updateDepense(id: string, input: Partial<DepenseFormInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("depenses").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/depenses");
  return { error: null };
}

export async function deleteDepense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("depenses").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/depenses");
  return { error: null };
}
