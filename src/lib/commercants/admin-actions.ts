"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Réinitialise le mot de passe d'un commerçant depuis sa fiche admin.
// Utilise l'API admin Supabase (clé service_role, jamais exposée au
// client) — appelable uniquement par un admin authentifié.
export async function resetCommercantPassword(commercantId: string, nouveauMotDePasse: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Action réservée à l'administrateur." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(commercantId, {
    password: nouveauMotDePasse,
  });

  return { error: error?.message ?? null };
}
