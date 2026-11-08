import { createClient } from "@/lib/supabase/server";
import Pagination from "@/components/admin/Pagination";
import { listDepensesPage } from "@/lib/depenses/queries";
import { listFournisseurs } from "@/lib/fournisseurs/queries";
import DepenseList from "@/components/depenses/DepenseList";

const PAR_PAGE = 50;

export default async function DepensesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Math.floor(Number(pageParam)) || 1);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [resultat, fournisseurs] = user
    ? await Promise.all([listDepensesPage(user.id, page, PAR_PAGE), listFournisseurs(user.id)])
    : [{ depenses: [], total: 0 }, []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <DepenseList depenses={resultat.depenses} fournisseurs={fournisseurs} />
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(resultat.total / PAR_PAGE))}
        makeHref={(p) => `/depenses?page=${p}`}
      />
    </main>
  );
}
