import DocumentStatsGrid from "@/components/rapports/document/DocumentStatsGrid";

type ApercuGlobalSectionProps = {
  chiffreAffaires: number;
  totalDepenses: number;
  totalCreancesEnCours: number;
  margeBrute: number;
};

function formaterMontant(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

export default function ApercuGlobalSection({
  chiffreAffaires,
  totalDepenses,
  totalCreancesEnCours,
  margeBrute,
}: ApercuGlobalSectionProps) {
  return (
    <div>
      <p className="mb-[10px] text-[13px] font-bold text-[#1a1a1a]">
        Aperçu global (depuis le début)
      </p>
      <DocumentStatsGrid
        stats={[
          { label: "Chiffre d'affaires", valeur: formaterMontant(chiffreAffaires) },
          { label: "Créances", valeur: formaterMontant(totalCreancesEnCours) },
          { label: "Dépenses", valeur: formaterMontant(totalDepenses) },
          { label: "Marge brute", valeur: formaterMontant(margeBrute) },
        ]}
      />
    </div>
  );
}
