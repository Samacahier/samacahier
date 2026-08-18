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

export type CommercantUpdateInput = Partial<
  Pick<Commercant, "nom_commerce" | "activite" | "actif">
>;

// Utilisé par l'admin pour corriger les infos de base d'un commerçant ou
// activer/désactiver son compte (RLS : autorisé pour is_admin()).
export async function updateCommercant(id: string, input: CommercantUpdateInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("commercants").update(input).eq("id", id);
  return { error: error?.message ?? null };
}
