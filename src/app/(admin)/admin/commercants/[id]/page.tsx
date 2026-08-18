import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommercant } from "@/lib/commercants/queries";
import { getDashboardStats } from "@/lib/dashboard/queries";
import { listVentes } from "@/lib/ventes/queries";
import { listStocks } from "@/lib/stocks/queries";
import { listCreances } from "@/lib/creances/queries";
import { listCaisse } from "@/lib/caisse/queries";
import StatCard from "@/components/dashboard/StatCard";
import CommercantToggleActif from "@/components/admin/CommercantToggleActif";
import CommercantEditForm from "@/components/admin/CommercantEditForm";
import CommercantResetPassword from "@/components/admin/CommercantResetPassword";
import SectionTable from "@/components/admin/SectionTable";

export default async function CommercantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const commercant = await getCommercant(id);
  if (!commercant) notFound();

  const [stats, ventes, stocks, creances, caisse] = await Promise.all([
    getDashboardStats(id),
    listVentes(id),
    listStocks(id),
    listCreances(id),
    listCaisse(id),
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <div className="flex flex-col gap-1">
        <Link href="/admin/dashboard" className="text-sm text-ink-muted hover:text-accent-dark">
          ← Tous les commerçants
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-ink">{commercant.nom_commerce}</h1>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              commercant.actif
                ? "bg-status-paye-bg text-status-paye"
                : "bg-status-impaye-bg text-status-impaye"
            }`}
          >
            {commercant.actif ? "Actif" : "Désactivé"}
          </span>
        </div>
        <p className="text-sm text-ink-muted">{commercant.activite ?? "Activité non renseignée"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="CA (mois)"
          value={`${stats.chiffreAffaires.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          label="Dépenses (mois)"
          value={`${stats.totalDepenses.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          label="Solde caisse + poche"
          value={`${(stats.soldeCaisse + stats.soldePoche).toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          label="Créances en cours"
          value={`${stats.totalCreancesEnCours.toLocaleString("fr-FR")} FCFA`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-4">
          <h2 className="mb-3 font-semibold text-ink">Infos du commerce</h2>
          <CommercantEditForm
            commercantId={id}
            nomCommerce={commercant.nom_commerce}
            activite={commercant.activite}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-card p-4">
            <h2 className="mb-3 font-semibold text-ink">Compte</h2>
            <CommercantToggleActif commercantId={id} actif={commercant.actif} />
          </div>
          <div className="rounded-2xl bg-card p-4">
            <h2 className="mb-3 font-semibold text-ink">Mot de passe</h2>
            <CommercantResetPassword commercantId={id} />
          </div>
        </div>
      </div>

      <SectionTable
        titre={`Ventes (${ventes.length})`}
        colonnes={["Description", "Quantité", "Prix unitaire", "Total", "Statut", "Date"]}
        lignes={ventes.map((vente) => [
          vente.description,
          String(vente.quantite),
          `${vente.prix_unitaire.toLocaleString("fr-FR")} FCFA`,
          `${vente.montant_total.toLocaleString("fr-FR")} FCFA`,
          vente.statut,
          vente.date_vente,
        ])}
      />

      <SectionTable
        titre={`Stock (${stocks.length})`}
        colonnes={["Produit", "Quantité", "Unité", "Prix vente", "Seuil alerte"]}
        lignes={stocks.map((stock) => [
          stock.nom_article,
          String(stock.quantite),
          stock.unite,
          stock.prix_vente ? `${stock.prix_vente.toLocaleString("fr-FR")} FCFA` : "—",
          String(stock.seuil_alerte),
        ])}
      />

      <SectionTable
        titre={`Créances (${creances.length})`}
        colonnes={["Client", "Montant", "Remboursé", "Statut", "Échéance"]}
        lignes={creances.map((creance) => [
          creance.client_nom,
          `${creance.montant.toLocaleString("fr-FR")} FCFA`,
          `${creance.montant_rembourse.toLocaleString("fr-FR")} FCFA`,
          creance.statut,
          creance.date_echeance ?? "—",
        ])}
      />

      <SectionTable
        titre={`Mouvements de caisse (${caisse.length})`}
        colonnes={["Type", "Poche", "Montant", "Motif", "Date"]}
        lignes={caisse.map((mouvement) => [
          mouvement.type_mouvement,
          mouvement.type_poche,
          `${mouvement.montant.toLocaleString("fr-FR")} FCFA`,
          mouvement.motif ?? "—",
          mouvement.date_mouvement,
        ])}
      />
    </main>
  );
}
