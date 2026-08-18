type InscriptionsChartProps = {
  donnees: { date: string; count: number }[];
};

// Graphique en barres minimal (sans dépendance externe) : une barre par
// jour sur les 30 derniers jours, hauteur proportionnelle au maximum.
export default function InscriptionsChart({ donnees }: InscriptionsChartProps) {
  const max = Math.max(1, ...donnees.map((jour) => jour.count));

  return (
    <div className="rounded-2xl bg-card p-4">
      <span className="mb-3 block text-xs font-medium tracking-wide text-ink-muted uppercase">
        Inscriptions — 30 derniers jours
      </span>
      <div className="flex h-24 items-end gap-[3px]">
        {donnees.map((jour) => (
          <div
            key={jour.date}
            title={`${jour.date} — ${jour.count} inscription${jour.count > 1 ? "s" : ""}`}
            className="flex-1 rounded-sm bg-accent/70"
            style={{ height: `${(jour.count / max) * 100}%`, minHeight: jour.count > 0 ? "4px" : "1px" }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
        <span>{donnees[0]?.date}</span>
        <span>{donnees.at(-1)?.date}</span>
      </div>
    </div>
  );
}
