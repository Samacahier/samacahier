import { notFound } from "next/navigation";
import { getVenteById } from "@/lib/ventes/queries";
import { getCommercant } from "@/lib/commercants/queries";
import { createClient } from "@/lib/supabase/server";
import RecuContent from "@/components/ventes/RecuContent";
import RecuPageActions from "@/components/ventes/RecuPageActions";

type RecuVentePageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecuVentePage({ params }: RecuVentePageProps) {
  const { id } = await params;
  const vente = await getVenteById(id);
  if (!vente) notFound();

  const commercant = await getCommercant(vente.commercant_id);

  let clientNom = "Client comptant";
  if (vente.client_id) {
    const supabase = await createClient();
    const { data: client } = await supabase
      .from("clients")
      .select("nom")
      .eq("id", vente.client_id)
      .single();
    if (client) clientNom = client.nom;
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-page px-4 py-8 print:bg-white print:p-0">
      <RecuContent
        nomCommerce={commercant?.nom_commerce ?? "Commerce"}
        telephone={commercant?.telephone ?? null}
        adresse={commercant?.adresse ?? null}
        activite={commercant?.activite ?? null}
        clientNom={clientNom}
        vente={vente}
      />
      <RecuPageActions />
    </div>
  );
}
