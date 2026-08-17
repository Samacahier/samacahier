type SoldeCardProps = {
  devise: string;
  soldeInitial: number;
  entrees: number;
  sorties: number;
};

export default function SoldeCard({ devise, soldeInitial, entrees, sorties }: SoldeCardProps) {
  const soldeActuel = soldeInitial + entrees - sorties;

  return (
    <div className="rounded border p-4">
      <p className="text-sm text-zinc-600">SOLDE ACTUEL</p>
      <p className="text-3xl font-semibold">
        {soldeActuel.toLocaleString("fr-FR")} {devise}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-3 text-sm">
        <div>
          <p className="text-zinc-600">Initial</p>
          <p className="font-medium">{soldeInitial.toLocaleString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-zinc-600">Entrées</p>
          <p className="font-medium text-green-700">{entrees.toLocaleString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-zinc-600">Sorties</p>
          <p className="font-medium text-red-600">{sorties.toLocaleString("fr-FR")}</p>
        </div>
      </div>
    </div>
  );
}
