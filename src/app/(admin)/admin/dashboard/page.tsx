import { listCommercantsOverview } from "@/lib/dashboard/admin-queries";

export default async function AdminDashboardPage() {
  const overviews = await listCommercantsOverview();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Commerçants</h1>

      {overviews.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun commerçant inscrit.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Commerce</th>
              <th className="py-2">Inscription</th>
              <th className="py-2">Ventes (mois en cours)</th>
              <th className="py-2">Solde de caisse</th>
            </tr>
          </thead>
          <tbody>
            {overviews.map(({ commercant, totalVentesMontant, soldeCaisse }) => (
              <tr key={commercant.id} className="border-b">
                <td className="py-2">{commercant.nom_commerce}</td>
                <td className="py-2">{commercant.created_at.slice(0, 10)}</td>
                <td className="py-2">
                  {totalVentesMontant.toLocaleString("fr-FR")} FCFA
                </td>
                <td className="py-2">{soldeCaisse.toLocaleString("fr-FR")} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
