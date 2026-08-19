import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommercant } from "@/lib/commercants/queries";
import { getDashboardStats } from "@/lib/dashboard/queries";
import StatCard from "@/components/dashboard/StatCard";
import CommercantToggleActif from "@/components/admin/CommercantToggleActif";
import CommercantSendEmail from "@/components/admin/CommercantSendEmail";
import CommercantAvatar from "@/components/admin/CommercantAvatar";

export default async function CommercantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const commercant = await getCommercant(id);
  if (!commercant) notFound();

  const stats = await getDashboardStats(id);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <div className="flex flex-col gap-1">
        <Link href="/admin/dashboard" className="text-sm text-ink-muted hover:text-accent-dark">
          ← Tous les commerçants
        </Link>
        <div className="flex items-center gap-3">
          <CommercantAvatar
            logoUrl={commercant.logo_url}
            nom={commercant.nom_commerce}
            taille="lg"
          />
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

      <p className="text-xs text-ink-muted">
        Indicateurs agrégés uniquement — les données détaillées (ventes, stock, créances,
        mouvements de caisse) appartiennent au commerçant et ne sont pas consultables depuis
        l&apos;administration.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-4">
          <h2 className="mb-3 font-semibold text-ink">Compte</h2>
          <CommercantToggleActif commercantId={id} actif={commercant.actif} />
        </div>
        <div className="rounded-2xl bg-card p-4">
          <h2 className="mb-3 font-semibold text-ink">Envoyer un email</h2>
          <CommercantSendEmail commercantId={id} />
        </div>
      </div>
    </main>
  );
}
