import { createClient } from "@/lib/supabase/server";
import { listVentes } from "@/lib/ventes/queries";
import VenteList from "@/components/ventes/VenteList";

export default async function VentesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ventes = user ? await listVentes(user.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <VenteList ventes={ventes} />
    </main>
  );
}
