import { createClient } from "@/lib/supabase/server";
import { listCaisse } from "@/lib/caisse/queries";
import { getCommercant } from "@/lib/commercants/queries";
import { listCreances } from "@/lib/creances/queries";
import TresorerieTabs from "@/components/tresorerie/TresorerieTabs";

export default async function TresoreriePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [commercant, mouvements, creances] = user
    ? await Promise.all([
        getCommercant(user.id),
        listCaisse(user.id),
        listCreances(user.id),
      ])
    : [null, [], []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <TresorerieTabs commercant={commercant} mouvements={mouvements} creances={creances} />
    </main>
  );
}
