import { createClient } from "@/lib/supabase/server";
import { listVentes } from "@/lib/ventes/queries";
import { listStocks } from "@/lib/stocks/queries";
import { listClients } from "@/lib/clients/queries";
import VenteList from "@/components/ventes/VenteList";

export default async function VentesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ventes, produits, clients] = user
    ? await Promise.all([listVentes(user.id), listStocks(user.id), listClients(user.id)])
    : [[], [], []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <VenteList ventes={ventes} produits={produits} clients={clients} />
    </main>
  );
}
