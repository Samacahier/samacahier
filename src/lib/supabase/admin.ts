import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client service_role : réservé aux actions serveur nécessitant l'API admin
// Supabase (ex. reset de mot de passe). Ne jamais importer depuis un
// composant client — la clé service_role contourne entièrement RLS.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
