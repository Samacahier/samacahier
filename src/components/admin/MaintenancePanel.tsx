"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { definirMaintenance, type EtatMaintenance } from "@/lib/admin/maintenance";

// Interrupteur du mode maintenance (Vue d'ensemble admin). Quand il est
// actif, les commerçants et visiteurs voient la page /maintenance ; les
// admins gardent l'accès complet. Propagation : ~15 s (cache du proxy).
export default function MaintenancePanel({ etat }: { etat: EtatMaintenance }) {
  const router = useRouter();
  const [message, setMessage] = useState(etat.message ?? "");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function basculer() {
    const activer = !etat.active;
    if (
      activer &&
      !window.confirm(
        "Mettre le site en maintenance ? Les commerçants ne pourront plus utiliser Sama Cahier tant que vous ne l'aurez pas désactivé.",
      )
    ) {
      return;
    }

    setLoading(true);
    setErreur(null);
    const { error } = await definirMaintenance(activer, message);
    setLoading(false);

    if (error) {
      setErreur(error);
      return;
    }
    router.refresh();
  }

  return (
    <div
      className={`rounded-2xl border p-5 ${
        etat.active ? "border-status-impaye bg-status-impaye-bg" : "border-line bg-card"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-ink-muted" />
            <span className="text-[10.5px] font-bold tracking-wide text-ink-muted uppercase">
              Mode maintenance
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                etat.active ? "bg-status-impaye text-white" : "bg-status-paye-bg text-status-paye"
              }`}
            >
              {etat.active ? "ACTIF — site fermé aux commerçants" : "Site en ligne"}
            </span>
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink-muted">
            Message affiché aux utilisateurs (facultatif)
            <input
              type="text"
              maxLength={280}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ex. : Mise à jour en cours, retour prévu à 14h."
              className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
            />
          </label>
          {erreur && <p className="text-sm text-status-impaye">{erreur}</p>}
        </div>

        <button
          type="button"
          onClick={basculer}
          disabled={loading}
          className={`rounded-xl px-4 py-2 font-medium text-white disabled:opacity-50 ${
            etat.active ? "bg-status-paye" : "bg-status-impaye"
          }`}
        >
          {loading
            ? "Enregistrement..."
            : etat.active
              ? "Remettre le site en ligne"
              : "Activer la maintenance"}
        </button>
      </div>
    </div>
  );
}
