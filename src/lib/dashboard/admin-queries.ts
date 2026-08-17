"use server";

import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/dashboard/queries";
import type { Commercant } from "@/types/database";

export type CommercantOverview = {
  commercant: Commercant;
  totalVentesMontant: number;
  soldeCaisse: number;
};

// Liste tous les commerçants (accessible uniquement à l'admin via RLS) avec
// leurs indicateurs clés, calculés via la même logique que le dashboard
// commerçant (getDashboardStats), grâce à public.is_admin() dans les policies.
export async function listCommercantsOverview(): Promise<CommercantOverview[]> {
  const supabase = await createClient();
  const { data: commercants, error } = await supabase
    .from("commercants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return Promise.all(
    (commercants ?? []).map(async (commercant) => {
      const stats = await getDashboardStats(commercant.id);
      return {
        commercant,
        totalVentesMontant: stats.totalVentesMontant,
        soldeCaisse: stats.soldeCaisse,
      };
    }),
  );
}
