type CaEvolutionChartProps = {
  donnees: { mois: string; ca: number }[];
};

const LARGEUR = 600;
const HAUTEUR = 180;
const MARGE = 24;

// Graphique en courbe (SVG, sans dépendance externe) du CA cumulé de la
// plateforme, mois par mois.
export default function CaEvolutionChart({ donnees }: CaEvolutionChartProps) {
  const max = Math.max(1, ...donnees.map((mois) => mois.ca));
  const largeurUtile = LARGEUR - MARGE * 2;
  const hauteurUtile = HAUTEUR - MARGE * 2;
  const pas = donnees.length > 1 ? largeurUtile / (donnees.length - 1) : 0;
  const basY = MARGE + hauteurUtile;

  const points = donnees.map((mois, index) => ({
    x: MARGE + index * pas,
    y: basY - (mois.ca / max) * hauteurUtile,
    mois,
  }));

  const ligne = points.map((p) => `${p.x},${p.y}`).join(" ");
  const aire = `${MARGE},${basY} ${ligne} ${MARGE + largeurUtile},${basY}`;

  return (
    <div className="rounded-2xl bg-card p-4">
      <span className="mb-3 block text-xs font-medium tracking-wide text-ink-muted uppercase">
        CA plateforme — {donnees.length} derniers mois
      </span>
      <svg
        viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`}
        preserveAspectRatio="none"
        className="h-44 w-full"
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
        {points.map((p) => (
          <circle key={p.mois.mois} cx={p.x} cy={p.y} r={3} fill="var(--color-accent)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
        {donnees.map((mois) => (
          <span key={mois.mois}>{mois.mois}</span>
        ))}
      </div>
    </div>
  );
}
