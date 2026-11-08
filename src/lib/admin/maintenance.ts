"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageErreur } from "@/lib/utils/erreurs";

export type EtatMaintenance = {
  active: boolean;
  message: string | null;
  updatedAt: string | null;
};

export async function getEtatMaintenance(): Promise<EtatMaintenance> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parametres_plateforme")
    .select("maintenance_active, maintenance_message, updated_at")
    .eq("id", 1)
    .maybeSingle();

  return {
    active: data?.maintenance_active ?? false,
    message: data?.maintenance_message ?? null,
    updatedAt: data?.updated_at ?? null,
  };
}

// Active / désactive le mode maintenance. La RLS n'autorise l'UPDATE qu'à
// un admin ; on vérifie quand même le rôle pour renvoyer un message clair,
// et l'action est journalisée dans admin_logs.
export async function definirMaintenance(active: boolean, message: string | null) {
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

  const messageNettoye = message?.trim() || null;

  const { error } = await supabase
    .from("parametres_plateforme")
    .update({
      maintenance_active: active,
      maintenance_message: messageNettoye,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", 1);

  if (error) return { error: messageErreur(error, "admin") };

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: active ? "maintenance_activee" : "maintenance_desactivee",
    commercant_id: null,
    detail: active
      ? `Mode maintenance activé${messageNettoye ? ` — « ${messageNettoye} »` : ""}`
      : "Mode maintenance désactivé",
  });

  revalidatePath("/admin/vue-ensemble");
  return { error: null };
}
