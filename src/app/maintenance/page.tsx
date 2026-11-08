import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import EtatPage from "@/components/ui/EtatPage";

export const metadata: Metadata = {
  title: "Maintenance en cours",
  robots: { index: false },
};

// Affichée par le proxy (réécriture, HTTP 503) quand le mode maintenance est
// actif. Lit le message personnalisé saisi par l'admin.
export default async function MaintenancePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parametres_plateforme")
    .select("maintenance_message")
    .eq("id", 1)
    .maybeSingle();

  return (
    <EtatPage
      titre="Maintenance en cours"
      message={
        data?.maintenance_message ??
        "Sama Cahier est en cours de mise à jour pour mieux vous servir. Vos données sont en sécurité. Merci de réessayer dans quelques instants."
      }
    />
  );
}
