import { notFound } from "next/navigation";
import { getVenteById } from "@/lib/ventes/queries";
import { getCommercant } from "@/lib/commercants/queries";
import PrintButton from "@/components/ui/PrintButton";

type RecuVentePageProps = {
  params: Promise<{ id: string }>;
};

const MODE_PAIEMENT_LABELS: Record<string, string> = {
  especes: "Espèces",
  mobile_money: "Mobile money",
  virement: "Virement",
  autre: "Autre",
};

export default async function RecuVentePage({ params }: RecuVentePageProps) {
  const { id } = await params;
  const vente = await getVenteById(id);

  if (!vente) notFound();

  const commercant = await getCommercant(vente.commercant_id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="rounded-2xl bg-card p-8 text-ink print:rounded-none print:border print:border-line">
        <header className="mb-8 flex items-start justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-xl font-semibold">
              {commercant?.nom_commerce ?? "Commerce"}
            </h1>
            {commercant?.adresse && (
              <p className="text-sm text-ink-muted">{commercant.adresse}</p>
            )}
            {commercant?.telephone && (
              <p className="text-sm text-ink-muted">{commercant.telephone}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-muted">Reçu de vente</p>
            <p className="text-sm text-ink-muted">{vente.date_vente}</p>
          </div>
        </header>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 text-ink-muted">Description</th>
              <th className="py-2 text-ink-muted">Quantité</th>
              <th className="py-2 text-ink-muted">Prix unitaire</th>
              <th className="py-2 text-ink-muted">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-2">{vente.description}</td>
              <td className="py-2">{vente.quantite}</td>
              <td className="py-2">{vente.prix_unitaire.toLocaleString("fr-FR")} FCFA</td>
              <td className="py-2">
                {vente.montant_total.toLocaleString("fr-FR")} FCFA
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <p className="text-lg font-semibold">
            Total : {vente.montant_total.toLocaleString("fr-FR")} FCFA
          </p>
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          Mode de paiement : {MODE_PAIEMENT_LABELS[vente.mode_paiement]}
        </p>
      </div>
    </div>
  );
}
