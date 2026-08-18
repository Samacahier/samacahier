import { listCommercantsOverview, getAdminKpis } from "@/lib/dashboard/admin-queries";
import StatCard from "@/components/dashboard/StatCard";
import InscriptionsChart from "@/components/admin/InscriptionsChart";
import CommercantsTable from "@/components/admin/CommercantsTable";

export default async function AdminDashboardPage() {
  const overviews = await listCommercantsOverview();
  const kpis = await getAdminKpis(overviews);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Commerçants</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Commerçants actifs" value={String(kpis.commercantsActifs)} />
        <StatCard
          label="CA plateforme (mois)"
          value={`${kpis.caCumuleMois.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard label="Nouveaux inscrits (7j)" value={String(kpis.nouveauxInscrits7j)} />
        <StatCard label="Inactifs (14j)" value={String(kpis.inactifs14j)} />
      </div>

      <InscriptionsChart donnees={kpis.inscriptionsParJour} />

      <CommercantsTable overviews={overviews} />
    </main>
  );
}
