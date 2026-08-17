"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database, Stock } from "@/types/database";

type StockInsert = Database["public"]["Tables"]["stocks"]["Insert"];

export type StockFormInput = Omit<
  StockInsert,
  "id" | "commercant_id" | "created_at" | "updated_at" | "code_produit"
>;

export async function listStocks(commercantId: string): Promise<Stock[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("nom_article", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createStock(input: StockFormInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { error } = await supabase
    .from("stocks")
    .insert({ ...input, commercant_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/stocks");
  return { error: null };
}

export async function updateStock(id: string, input: Partial<StockFormInput>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("stocks")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/stocks");
  return { error: null };
}

export async function deleteStock(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("stocks").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/stocks");
  return { error: null };
}
