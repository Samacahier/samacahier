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
    <div className="rounded-2xl bg-card p-6 text-ink print:border print:border-line print:p-6">
      <p className="mb-4 text-xs font-medium tracking-wide text-ink-muted uppercase">
        Aperçu global (depuis le début)
      </p>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-ink-muted">Chiffre d&apos;affaires</dt>
          <dd className="text-xl font-semibold">
            {chiffreAffaires.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Créances</dt>
          <dd className="text-xl font-semibold">
            {totalCreancesEnCours.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Dépenses</dt>
          <dd className="text-xl font-semibold">
            {totalDepenses.toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Marge brute</dt>
          <dd className="text-xl font-semibold">{margeBrute.toLocaleString("fr-FR")} FCFA</dd>
        </div>
      </dl>
    </div>
  );
}
