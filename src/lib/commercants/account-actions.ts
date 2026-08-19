"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommercant } from "@/lib/commercants/queries";

// Suppression de compte par le commerçant lui-même (Paramètres > zone de
// danger). Cascade native vérifiée en base : auth.users -> profiles ->
// commercants -> ventes/depenses/stocks/creances/caisse/clients/
// fournisseurs sont toutes en ON DELETE CASCADE, donc un seul appel à
// l'API admin suffit — pas de suppressions explicites table par table.
export async function deleteMyAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };

  const commercant = await getCommercant(user.id);
  const admin = createAdminClient();

  // Écrit via le client service_role : la policy RLS d'admin_logs
  // n'autorise que is_admin(), or c'est un commerçant qui se supprime
  // lui-même. admin_id = son propre id (nullable + ON DELETE SET NULL,
  // la ligne survit à la suppression du compte qu'elle référence).
  await admin.from("admin_logs").insert({
    admin_id: user.id,
    action: "suppression_compte",
    commercant_id: user.id,
    detail: `Suppression de compte par le commerçant lui-même — ${commercant?.nom_commerce ?? user.id}`,
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);

  return { error: error?.message ?? null };
}
