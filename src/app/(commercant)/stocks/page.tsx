import { createClient } from "@/lib/supabase/server";
import { listStocks } from "@/lib/stocks/queries";
import { listFournisseurs } from "@/lib/fournisseurs/queries";
import StockList from "@/components/stocks/StockList";

export default async function StocksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [stocks, fournisseurs] = user
    ? await Promise.all([listStocks(user.id), listFournisseurs(user.id)])
    : [[], []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <StockList stocks={stocks} fournisseurs={fournisseurs} />
    </main>
  );
}
