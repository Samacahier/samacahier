import Link from "next/link";
import type { OperationRecente } from "@/lib/dashboard/queries";

type DernieresOperationsProps = {
  operations: OperationRecente[];
};

const TYPE_BADGE: Record<OperationRecente["type"], string> = {
  vente: "bg-status-paye-bg text-status-paye",
  depense: "bg-status-impaye-bg text-status-impaye",
};

const TYPE_LABEL: Record<OperationRecente["type"], string> = {
  vente: "Vente",
  depense: "Dépense",
};

export default function DernieresOperations({ operations }: DernieresOperationsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium tracking-wide text-ink-muted uppercase">
          Dernières opérations
        </h2>
        <Link href="/ventes" className="text-sm text-accent underline">
          Tout voir
        </Link>
      </div>

      {operations.length === 0 ? (
        <p className="rounded-2xl bg-card p-4 text-sm text-ink-muted">
          Aucune opération enregistrée.
        </p>
      ) : (
        <>
          {/* Mobile / tablette (<1024px) : empilement de cartes */}
          <ul className="flex flex-col gap-2 lg:hidden">
            {operations.map((operation) => (
              <li
                key={`${operation.type}-${operation.id}`}
                className="flex items-center justify-between rounded-2xl bg-card px-3 py-2 text-sm"
              >
                <div>
                  <span
                    className={`mr-2 rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_BADGE[operation.type]}`}
                  >
                    {TYPE_LABEL[operation.type]}
                  </span>
                  {operation.description}
                </div>
                <span className="font-medium text-ink">
                  {operation.montant.toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>

          {/* Desktop (≥1024px) : table pleine largeur */}
          <div className="hidden overflow-hidden rounded-2xl bg-card lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-ink-muted">Type</th>
                  <th className="px-4 py-3 text-ink-muted">Description</th>
                  <th className="px-4 py-3 text-ink-muted">Date</th>
                  <th className="px-4 py-3 text-ink-muted">Montant</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((operation) => (
                  <tr key={`${operation.type}-${operation.id}`} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_BADGE[operation.type]}`}
                      >
                        {TYPE_LABEL[operation.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">{operation.description}</td>
                    <td className="px-4 py-3 text-ink-muted">{operation.date}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {operation.montant.toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
