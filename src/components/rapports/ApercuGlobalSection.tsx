type ApercuGlobalSectionProps = {
  chiffreAffaires: number;
  totalDepenses: number;
  totalCreancesEnCours: number;
  margeBrute: number;
};

export default function ApercuGlobalSection({
  chiffreAffaires,
  totalDepenses,
  totalCreancesEnCours,
  margeBrute,
}: ApercuGlobalSectionProps) {
  return (
    <div className="rounded border p-6 text-black print:border-0 print:p-0">
      <p className="mb-4 text-sm font-semibold text-zinc-600">
        APERÇU GLOBAL (DEPUIS LE DÉBUT)
      </p>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-zinc-600">Chiffre d&apos;affaires</dt>
          <dd className="text-xl font-semibold">
            {chiffreAffaires.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Créances</dt>
          <dd className="text-xl font-semibold">
            {totalCreancesEnCours.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Dépenses</dt>
          <dd className="text-xl font-semibold">
            {totalDepenses.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-600">Marge brute</dt>
          <dd className="text-xl font-semibold">{margeBrute.toLocaleString("fr-FR")} FCFA</dd>
        </div>
      </dl>
    </div>
  );
}
