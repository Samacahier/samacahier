type InscriptionsChartProps = {
  donnees: { date: string; count: number }[];
};

const LARGEUR = 600;
const HAUTEUR = 160;
const MARGE = 20;

// Graphique en courbe (SVG, sans dépendance externe) des inscriptions
// jour par jour, avec aire remplie sous la courbe et repères de dates.
export default function InscriptionsChart({ donnees }: InscriptionsChartProps) {
  const max = Math.max(1, ...donnees.map((jour) => jour.count));
  const largeurUtile = LARGEUR - MARGE * 2;
  const hauteurUtile = HAUTEUR - MARGE * 2;
  const pas = donnees.length > 1 ? largeurUtile / (donnees.length - 1) : 0;
  const basY = MARGE + hauteurUtile;

  const points = donnees.map((jour, index) => ({
    x: MARGE + index * pas,
    y: basY - (jour.count / max) * hauteurUtile,
    jour,
  }));

  const ligne = points.map((p) => `${p.x},${p.y}`).join(" ");
  const aire = `${MARGE},${basY} ${ligne} ${MARGE + largeurUtile},${basY}`;
  const milieu = donnees[Math.floor(donnees.length / 2)];

  return (
    <div className="rounded-2xl bg-card p-4">
      <span className="mb-3 block text-xs font-medium tracking-wide text-ink-muted uppercase">
        Inscriptions — 30 derniers jours
      </span>
      <svg
        viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
        preserveAspectRatio="none"
        className="h-40 w-full"
      >
        <line
          x1={MARGE}
          y1={basY}
          x2={MARGE + largeurUtile}
          y2={basY}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
        <polygon points={aire} fill="var(--color-accent)" fillOpacity={0.12} />
        <polyline points={ligne} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
        {points.map(
          (p) =>
            p.jour.count > 0 && (
              <circle key={p.jour.date} cx={p.x} cy={p.y} r={2.5} fill="var(--color-accent)" />
            ),
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
        <span>{donnees[0]?.date}</span>
        <span>{milieu?.date}</span>
        <span>{donnees.at(-1)?.date}</span>
      </div>
    </div>
  );
}
