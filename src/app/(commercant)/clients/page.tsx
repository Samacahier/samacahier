import { createClient } from "@/lib/supabase/server";
import { listClients } from "@/lib/clients/queries";
import ClientList from "@/components/clients/ClientList";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clients = user ? await listClients(user.id) : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <ClientList clients={clients} />
    </main>
  );
}
