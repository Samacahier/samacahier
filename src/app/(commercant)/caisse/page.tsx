import { createClient } from "@/lib/supabase/server";
import { listCaisse } from "@/lib/caisse/queries";
import CaisseList from "@/components/caisse/CaisseList";

export default async function CaissePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mouvements = user ? await listCaisse(user.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <CaisseList mouvements={mouvements} />
    </main>
  );
}
