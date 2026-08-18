"use client";

import type { ComparatifCommercant } from "@/lib/rapports/admin-queries";

type ComparatifTableProps = {
  lignes: ComparatifCommercant[];
};

function echapperCsv(valeur: string): string {
  return `"${valeur.replace(/"/g, '""')}"`;
}

function exporterCsv(lignes: ComparatifCommercant[]) {
  const entetes = ["Commerce", "CA du mois (FCFA)", "Nombre de ventes"];
  const corps = lignes.map((ligne) =>
    [echapperCsv(ligne.nomCommerce), ligne.ca, ligne.nombreVentes].join(","),
  );
  const csv = [entetes.join(","), ...corps].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `commercants-${new Date().toISOString().slice(0, 10)}.csv`;
  lien.click();
  URL.revokeObjectURL(url);
}

export default function ComparatifTable({ lignes }: ComparatifTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink">Comparatif des commerçants (mois en cours)</h2>
        <button
          type="button"
          onClick={() => exporterCsv(lignes)}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Exporter en CSV
        </button>
      </div>

      {lignes.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun commerçant.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Commerce</th>
                <th className="py-2 text-ink-muted">CA du mois</th>
                <th className="py-2 text-ink-muted">Ventes</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne) => (
                <tr key={ligne.commercantId} className="border-b border-line">
                  <td className="py-2 text-ink">{ligne.nomCommerce}</td>
                  <td className="py-2 text-ink">{ligne.ca.toLocaleString("fr-FR")} FCFA</td>
                  <td className="py-2 text-ink">{ligne.nombreVentes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
