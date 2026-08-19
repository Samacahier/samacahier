import Link from "next/link";
import { listAdminLogsRecents } from "@/lib/admin/logs-queries";

const NOMBRE_AFFICHE = 3;

const LIBELLES_ACTION: Record<string, string> = {
  activation: "Compte activé",
  desactivation: "Compte désactivé",
  reinitialisation_mot_de_passe: "Mot de passe réinitialisé",
  correction_infos: "Infos corrigées",
};

function formaterDateRelative(dateIso: string): string {
  const date = new Date(dateIso);
  const maintenant = new Date();
  const diffMs = maintenant.getTime() - date.getTime();
  const diffHeures = diffMs / (1000 * 60 * 60);
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const memeJour = date.toDateString() === maintenant.toDateString();
  if (memeJour) {
    if (diffHeures < 1) return `Il y a ${Math.max(1, Math.round(diffMs / (1000 * 60)))} min`;
    return `Il y a ${Math.round(diffHeures)}h`;
  }

  const hier = new Date(maintenant);
  hier.setDate(hier.getDate() - 1);
  if (date.toDateString() === hier.toDateString()) return `Hier, ${heure}`;

  const jour = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  return `${jour}, ${heure}`;
}

// Aperçu des actions admin les plus récentes — journal complet sur
// /admin/journal.
export default async function DernieresActionsPanel() {
  const logs = await listAdminLogsRecents(NOMBRE_AFFICHE);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[10.5px] font-bold tracking-wide text-ink-muted uppercase">
          Dernières actions
        </span>
        <Link href="/admin/journal" className="text-[12.5px] font-bold text-accent-dark">
          Journal →
        </Link>
      </div>

      {logs.length === 0 && <p className="text-sm text-ink-muted">Aucune action récente.</p>}

      {logs.map((log) => (
        <div key={log.id} className="border-b border-line py-2.5 last:border-b-0">
          <p className="text-[12.5px] font-semibold text-ink">
            {LIBELLES_ACTION[log.action] ?? log.action}
            {log.commercantNom ? ` — ${log.commercantNom}` : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">{formaterDateRelative(log.created_at)}</p>
        </div>
      ))}
    </div>
  );
}
