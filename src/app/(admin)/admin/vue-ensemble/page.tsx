import { Store, CircleDollarSign, Sparkles, TriangleAlert } from "lucide-react";
import { listCommercantsOverview, getAdminKpis } from "@/lib/dashboard/admin-queries";
import KpiCard from "@/components/admin/KpiCard";
import InscriptionsChart from "@/components/admin/InscriptionsChart";
import TopCommercantsPanel from "@/components/admin/TopCommercantsPanel";
import DernieresActionsPanel from "@/components/admin/DernieresActionsPanel";

export default async function AdminVueEnsemblePage() {
  const overviews = await listCommercantsOverview();
  const kpis = await getAdminKpis(overviews);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Vue d&apos;ensemble</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Commerçants actifs"
          value={String(kpis.commercantsActifs)}
          Icone={Store}
          fondIcone="bg-[#eae3d8]"
          couleurIcone="text-ink"
        />
        <KpiCard
          label="CA plateforme (mois)"
          value={`${kpis.caCumuleMois.toLocaleString("fr-FR")} FCFA`}
          Icone={CircleDollarSign}
          fondIcone="bg-status-paye-bg"
          couleurIcone="text-status-paye"
        />
        <KpiCard
          label="Nouveaux inscrits (7j)"
          value={String(kpis.nouveauxInscrits7j)}
          Icone={Sparkles}
          fondIcone="bg-status-credit-bg"
          couleurIcone="text-status-credit"
        />
        <KpiCard
          label="Inactifs (14j)"
          value={String(kpis.inactifs14j)}
          Icone={TriangleAlert}
          fondIcone="bg-status-impaye-bg"
          couleurIcone="text-status-impaye"
        />
      </div>

      <InscriptionsChart donnees={kpis.inscriptionsParJour} />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <TopCommercantsPanel overviews={overviews} />
        <DernieresActionsPanel />
      </div>
    </main>
  );
}
