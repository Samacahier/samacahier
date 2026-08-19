import Link from "next/link";
import type { CommercantOverview } from "@/lib/dashboard/admin-queries";
import CommercantAvatar from "@/components/admin/CommercantAvatar";

type TopCommercantsPanelProps = {
  overviews: CommercantOverview[];
};

const NOMBRE_AFFICHE = 5;

function formaterDateInscription(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

// Classement des commerçants par CA du mois (déjà calculé dans overviews),
// aperçu pour la vue d'ensemble — liste complète sur /admin/commercants.
export default function TopCommercantsPanel({ overviews }: TopCommercantsPanelProps) {
  const classement = [...overviews]
    .sort((a, b) => b.chiffreAffaires - a.chiffreAffaires)
    .slice(0, NOMBRE_AFFICHE);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold tracking-wide text-ink-muted uppercase">
          Top commerçants (CA du mois)
        </span>
        <Link href="/admin/commercants" className="text-[12.5px] font-bold text-accent-dark">
          Voir tout →
        </Link>
      </div>

      {classement.length === 0 && <p className="text-sm text-ink-muted">Aucun commerçant.</p>}

      {classement.map((overview, index) => (
        <div
          key={overview.commercant.id}
          className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0"
        >
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-secondary text-[11px] font-bold text-ink-muted">
            {index + 1}
          </span>
          <CommercantAvatar logoUrl={overview.commercant.logo_url} nom={overview.commercant.nom_commerce} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {overview.commercant.nom_commerce}
            </p>
            <p className="text-[11px] text-ink-muted">
              Inscrit le {formaterDateInscription(overview.commercant.created_at)}
            </p>
          </div>
          <span className="font-mono text-[13.5px] font-bold text-ink">
            {overview.chiffreAffaires.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      ))}
    </div>
  );
}
