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
    <table className="w-full border-collapse text-left">
      <caption className="mb-[10px] text-left text-[13px] font-bold text-[#1a1a1a]">
        Ventes par statut
      </caption>
      <thead>
        <tr>
          <th className="border-b-[1.5px] border-[#1a1a1a] py-2 text-[10.5px] tracking-[0.05em] text-[#888] uppercase">
            Statut
          </th>
          <th className="border-b-[1.5px] border-[#1a1a1a] py-2 text-[10.5px] tracking-[0.05em] text-[#888] uppercase">
            Nombre
          </th>
          <th className="border-b-[1.5px] border-[#1a1a1a] py-2 text-right text-[10.5px] tracking-[0.05em] text-[#888] uppercase">
            Montant
          </th>
        </tr>
      </thead>
      <tbody>
        {(Object.keys(LABELS) as (keyof VentesParStatut)[]).map((statut) => (
          <tr key={statut}>
            <td className="border-b border-[#e2e2e2] py-[10px] text-[13px]">{LABELS[statut]}</td>
            <td className="border-b border-[#e2e2e2] py-[10px] text-[13px]">
              {statuts[statut].nombre}
            </td>
            <td className="font-jetbrains border-b border-[#e2e2e2] py-[10px] text-right text-[13px]">
              {statuts[statut].montant.toLocaleString("fr-FR")} FCFA
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
