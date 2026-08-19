import { createClient } from "@/lib/supabase/server";
import { getCommercant } from "@/lib/commercants/queries";
import ProfilForm from "@/components/profil/ProfilForm";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const commercant = user ? await getCommercant(user.id) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Profil</h1>
      {commercant && <ProfilForm commercant={commercant} />}
    </main>
  );
}
