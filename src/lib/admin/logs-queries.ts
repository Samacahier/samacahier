"use server";

import { createClient } from "@/lib/supabase/server";
import type { AdminLog } from "@/types/database";

export type LogEnrichi = AdminLog & {
  adminNom: string;
  commercantNom: string | null;
};

// Journal d'activité admin, le plus récent en premier, avec le nom de
// l'admin et du commerçant résolus (plutôt que leurs seuls id).
export async function listAdminLogs(): Promise<LogEnrichi[]> {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!logs || logs.length === 0) return [];

  const adminIds = [...new Set(logs.map((log) => log.admin_id))];
  const commercantIds = [
    ...new Set(logs.map((log) => log.commercant_id).filter((id): id is string => Boolean(id))),
  ];

  const [profiles, commercants] = await Promise.all([
    supabase.from("profiles").select("id, nom").in("id", adminIds),
    commercantIds.length > 0
      ? supabase.from("commercants").select("id, nom_commerce").in("id", commercantIds)
      : Promise.resolve({ data: [] as { id: string; nom_commerce: string }[] }),
  ]);

  const nomAdmin = new Map((profiles.data ?? []).map((profile) => [profile.id, profile.nom]));
  const nomCommercant = new Map(
    (commercants.data ?? []).map((commercant) => [commercant.id, commercant.nom_commerce]),
  );

  return logs.map((log) => ({
    ...log,
    adminNom: nomAdmin.get(log.admin_id) || "Admin",
    commercantNom: log.commercant_id ? (nomCommercant.get(log.commercant_id) ?? null) : null,
  }));
}
