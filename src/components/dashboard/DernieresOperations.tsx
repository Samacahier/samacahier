import Link from "next/link";
import type { OperationRecente } from "@/lib/dashboard/queries";

type DernieresOperationsProps = {
  operations: OperationRecente[];
};

export default function DernieresOperations({ operations }: DernieresOperationsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-600">Dernières opérations</h2>
        <Link href="/ventes" className="text-sm underline">
          Tout voir
        </Link>
      </div>

      {operations.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucune opération enregistrée.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {operations.map((operation) => (
            <li
              key={`${operation.type}-${operation.id}`}
              className="flex items-center justify-between rounded border px-3 py-2 text-sm"
            >
              <div>
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    operation.type === "vente"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {operation.type === "vente" ? "Vente" : "Dépense"}
                </span>
                {operation.description}
              </div>
              <span className="font-medium">
                {operation.montant.toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
