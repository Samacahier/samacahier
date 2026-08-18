import { listCommercantsOverview } from "@/lib/dashboard/admin-queries";

export default async function AdminDashboardPage() {
  const overviews = await listCommercantsOverview();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <h1 className="mb-6 text-2xl font-semibold text-ink">Commerçants</h1>

      {overviews.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun commerçant inscrit.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Commerce</th>
                <th className="py-2 text-ink-muted">Inscription</th>
                <th className="py-2 text-ink-muted">Ventes (mois en cours)</th>
                <th className="py-2 text-ink-muted">Solde de caisse</th>
              </tr>
            </thead>
            <tbody>
              {overviews.map(({ commercant, chiffreAffaires, soldeCaisse }) => (
                <tr key={commercant.id} className="border-b border-line">
                  <td className="py-2 text-ink">{commercant.nom_commerce}</td>
                  <td className="py-2 text-ink-muted">
                    {commercant.created_at.slice(0, 10)}
                  </td>
                  <td className="py-2 text-ink">
                    {chiffreAffaires.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="py-2 text-ink">
                    {soldeCaisse.toLocaleString("fr-FR")} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
