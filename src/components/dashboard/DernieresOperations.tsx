import Link from "next/link";
import type { OperationRecente } from "@/lib/dashboard/queries";

type DernieresOperationsProps = {
  operations: OperationRecente[];
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
        <ul className="flex flex-col gap-2">
          {operations.map((operation) => (
            <li
              key={`${operation.type}-${operation.id}`}
              className="flex items-center justify-between rounded-2xl bg-card px-3 py-2 text-sm"
            >
              <div>
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    operation.type === "vente"
                      ? "bg-status-paye-bg text-status-paye"
                      : "bg-status-impaye-bg text-status-impaye"
                  }`}
                >
                  {operation.type === "vente" ? "Vente" : "Dépense"}
                </span>
                {operation.description}
              </div>
              <span className="font-medium text-ink">
                {operation.montant.toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
