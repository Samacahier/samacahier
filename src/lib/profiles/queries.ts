"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getProfile(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();

  if (error) return null;
  return data;
}

export type ProfileUpdateInput = Partial<
  Pick<
    Profile,
    | "nom"
    | "telephone"
    | "avatar_url"
    | "notif_nouveau_commercant"
    | "notif_commercant_inactif"
    | "notif_resume_hebdo"
  >
>;

// RLS (profiles_update) : autorisé si id = auth.uid() ou is_admin().
export async function updateProfile(id: string, input: ProfileUpdateInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(input).eq("id", id);
  return { error: error?.message ?? null };
}
