import { createClient } from "@/lib/supabase/server";
import { listCreances } from "@/lib/creances/queries";
import CreanceList from "@/components/creances/CreanceList";

export default async function CreancesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const creances = user ? await listCreances(user.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <CreanceList creances={creances} />
    </main>
  );
}
