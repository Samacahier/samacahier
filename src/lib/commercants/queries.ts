"use server";

import { createClient } from "@/lib/supabase/server";
import type { Commercant } from "@/types/database";

export async function getCommercant(id: string): Promise<Commercant | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("commercants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
