import {
  listCommercantsOverviewPage,
  type CommercantsFiltre,
  type CommercantsTri,
} from "@/lib/dashboard/admin-queries";
import CommercantsTable from "@/components/admin/CommercantsTable";
import Pagination from "@/components/admin/Pagination";
import AutoRefresh from "@/components/admin/AutoRefresh";

const PAR_PAGE = 24;

type SearchParams = {
  page?: string;
  q?: string;
  filtre?: string;
  tri?: string;
};

function makeHref(params: SearchParams, page: number): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.filtre && params.filtre !== "tous") query.set("filtre", params.filtre);
  if (params.tri && params.tri !== "recent") query.set("tri", params.tri);
  if (page > 1) query.set("page", String(page));

  const qs = query.toString();
  return `/admin/dashboard${qs ? `?${qs}` : ""}`;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const filtre = (params.filtre as CommercantsFiltre) ?? "tous";
  const tri = (params.tri as CommercantsTri) ?? "recent";

  const { overviews, total } = await listCommercantsOverviewPage({
    page,
    pageSize: PAR_PAGE,
    recherche: params.q,
    filtre,
    tri,
  });
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <AutoRefresh />
      <h1 className="text-2xl font-semibold text-ink">Commerçants</h1>
      <CommercantsTable overviews={overviews} recherche={params.q ?? ""} filtre={filtre} tri={tri} />
      <Pagination page={page} totalPages={totalPages} makeHref={(p) => makeHref(params, p)} />
    </main>
  );
}
