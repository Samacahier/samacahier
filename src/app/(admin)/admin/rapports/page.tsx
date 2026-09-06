import { getEvolutionCaPlateforme, getComparatifCommercantsPage } from "@/lib/rapports/admin-queries";
import CaEvolutionChart from "@/components/admin/CaEvolutionChart";
import ComparatifTable from "@/components/admin/ComparatifTable";
import Pagination from "@/components/admin/Pagination";

const PAR_PAGE = 20;

export default async function AdminRapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [evolution, { lignes, total }] = await Promise.all([
    getEvolutionCaPlateforme(),
    getComparatifCommercantsPage(page, PAR_PAGE),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Rapports plateforme</h1>

      <CaEvolutionChart donnees={evolution} />

      <ComparatifTable lignes={lignes} />

      <Pagination
        page={page}
        totalPages={totalPages}
        makeHref={(p) => (p <= 1 ? "/admin/rapports" : `/admin/rapports?page=${p}`)}
      />
    </main>
  );
}
