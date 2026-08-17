type SoldeCardProps = {
  devise: string;
  soldeInitial: number;
  entrees: number;
  sorties: number;
};

export default function SoldeCard({ devise, soldeInitial, entrees, sorties }: SoldeCardProps) {
  const soldeActuel = soldeInitial + entrees - sorties;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-hero-start to-hero-end p-4 text-white">
      <p className="text-sm text-white/70">SOLDE ACTUEL</p>
      <p className="text-3xl font-semibold">
        {soldeActuel.toLocaleString("fr-FR")} {devise}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/20 pt-3 text-sm">
        <div>
          <p className="text-white/70">Initial</p>
          <p className="font-medium">{soldeInitial.toLocaleString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-white/70">Entrées</p>
          <p className="font-medium">{entrees.toLocaleString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-white/70">Sorties</p>
          <p className="font-medium">{sorties.toLocaleString("fr-FR")}</p>
        </div>
      </div>
    </div>
  );
}
