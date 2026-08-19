import { createClient } from "@/lib/supabase/server";
import { getCommercant } from "@/lib/commercants/queries";
import ChangerMotDePasse from "@/components/parametres/ChangerMotDePasse";
import DeviseForm from "@/components/parametres/DeviseForm";
import SupprimerCompte from "@/components/parametres/SupprimerCompte";

export default async function ParametresPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const commercant = user ? await getCommercant(user.id) : null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="text-2xl font-semibold text-ink">Paramètres</h1>

      <ChangerMotDePasse />

      {commercant && <DeviseForm commercantId={commercant.id} deviseActuelle={commercant.devise} />}

      <SupprimerCompte />
    </main>
  );
}
