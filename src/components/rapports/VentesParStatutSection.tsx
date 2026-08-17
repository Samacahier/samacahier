import type { VentesParStatut } from "@/lib/rapports/queries";

type VentesParStatutSectionProps = {
  statuts: VentesParStatut;
};

const LABELS: Record<keyof VentesParStatut, string> = {
  paye: "Payé",
  credit: "Crédit",
  impaye: "Impayé",
};

const BADGE: Record<keyof VentesParStatut, string> = {
  paye: "bg-status-paye-bg text-status-paye",
  credit: "bg-status-credit-bg text-status-credit",
  impaye: "bg-status-impaye-bg text-status-impaye",
};

export default function VentesParStatutSection({ statuts }: VentesParStatutSectionProps) {
  return (
    <div className="rounded-2xl bg-card p-6 text-ink print:border print:border-line print:p-6">
      <p className="mb-4 text-xs font-medium tracking-wide text-ink-muted uppercase">
        Ventes par statut
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="py-2 text-ink-muted">Statut</th>
            <th className="py-2 text-ink-muted">Nombre</th>
            <th className="py-2 text-ink-muted">Montant</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(LABELS) as (keyof VentesParStatut)[]).map((statut) => (
            <tr key={statut} className="border-b border-line">
              <td className="py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE[statut]}`}
                >
                  {LABELS[statut]}
                </span>
              </td>
              <td className="py-2">{statuts[statut].nombre}</td>
              <td className="py-2">{statuts[statut].montant.toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
