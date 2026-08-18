import { getEvolutionCaPlateforme, getComparatifCommercants } from "@/lib/rapports/admin-queries";
import CaEvolutionChart from "@/components/admin/CaEvolutionChart";
import ComparatifTable from "@/components/admin/ComparatifTable";

export default async function AdminRapportsPage() {
  const [evolution, comparatif] = await Promise.all([
    getEvolutionCaPlateforme(),
    getComparatifCommercants(),
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Rapports plateforme</h1>

      <CaEvolutionChart donnees={evolution} />

      <ComparatifTable lignes={comparatif} />
    </main>
  );
}
