import { createClient } from "@/lib/supabase/server";
import Pagination from "@/components/admin/Pagination";
import { listVentesPage } from "@/lib/ventes/queries";
import { listStocks } from "@/lib/stocks/queries";
import { listClients } from "@/lib/clients/queries";
import { getCommercant } from "@/lib/commercants/queries";
import VenteList from "@/components/ventes/VenteList";

const PAR_PAGE = 50;

export default async function VentesPage({
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

  const [resultat, produits, clients, commercant] = user
    ? await Promise.all([
        listVentesPage(user.id, page, PAR_PAGE),
        listStocks(user.id),
        listClients(user.id),
        getCommercant(user.id),
      ])
    : [{ ventes: [], total: 0 }, [], [], null];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <VenteList ventes={resultat.ventes} produits={produits} clients={clients} commercant={commercant} />
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(resultat.total / PAR_PAGE))}
        makeHref={(p) => `/ventes?page=${p}`}
      />
    </main>
  );
}
