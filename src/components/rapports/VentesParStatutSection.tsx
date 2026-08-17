import type { VentesParStatut } from "@/lib/rapports/queries";

type VentesParStatutSectionProps = {
  statuts: VentesParStatut;
};

const LABELS: Record<keyof VentesParStatut, string> = {
  paye: "Payé",
  credit: "Crédit",
  impaye: "Impayé",
};

export default function VentesParStatutSection({ statuts }: VentesParStatutSectionProps) {
  return (
    <div className="rounded border p-6 text-black print:border-0 print:p-0">
      <p className="mb-4 text-sm font-semibold text-zinc-600">VENTES PAR STATUT</p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Statut</th>
            <th className="py-2">Nombre</th>
            <th className="py-2">Montant</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(LABELS) as (keyof VentesParStatut)[]).map((statut) => (
            <tr key={statut} className="border-b">
              <td className="py-2">{LABELS[statut]}</td>
              <td className="py-2">{statuts[statut].nombre}</td>
              <td className="py-2">{statuts[statut].montant.toLocaleString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
