import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, type DashboardStats } from "@/lib/dashboard/queries";
import StatCard from "@/components/dashboard/StatCard";
import DashboardNav from "@/components/dashboard/DashboardNav";

const STATS_VIDES: DashboardStats = {
  totalVentesMontant: 0,
  totalVentesNombre: 0,
  totalDepenses: 0,
  soldeCaisse: 0,
  totalCreancesEnCours: 0,
  articlesEnAlerte: 0,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = user ? await getDashboardStats(user.id) : STATS_VIDES;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Tableau de bord</h1>

      <DashboardNav />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          label="Ventes (mois en cours)"
          value={`${stats.totalVentesMontant.toLocaleString("fr-FR")} FCFA`}
          hint={`${stats.totalVentesNombre} vente${stats.totalVentesNombre > 1 ? "s" : ""}`}
        />
        <StatCard
          label="Dépenses (mois en cours)"
          value={`${stats.totalDepenses.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          label="Solde de caisse"
          value={`${stats.soldeCaisse.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          label="Créances en cours"
          value={`${stats.totalCreancesEnCours.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard label="Articles en alerte" value={String(stats.articlesEnAlerte)} />
      </div>
    </main>
  );
}
