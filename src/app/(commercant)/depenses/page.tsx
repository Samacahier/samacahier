import { createClient } from "@/lib/supabase/server";
import { listDepenses } from "@/lib/depenses/queries";
import { listFournisseurs } from "@/lib/fournisseurs/queries";
import DepenseList from "@/components/depenses/DepenseList";

export default async function DepensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [depenses, fournisseurs] = user
    ? await Promise.all([listDepenses(user.id), listFournisseurs(user.id)])
    : [[], []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <DepenseList depenses={depenses} fournisseurs={fournisseurs} />
    </main>
  );
}
