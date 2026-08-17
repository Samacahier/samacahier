import { createClient } from "@/lib/supabase/server";
import { listFournisseurs } from "@/lib/fournisseurs/queries";
import FournisseurList from "@/components/fournisseurs/FournisseurList";

export default async function FournisseursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fournisseurs = user ? await listFournisseurs(user.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <FournisseurList fournisseurs={fournisseurs} />
    </main>
  );
}
