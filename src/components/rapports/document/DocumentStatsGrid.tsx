type Stat = { label: string; valeur: string };

type DocumentStatsGridProps = {
  stats: Stat[];
};

// Grille de chiffres façon document imprimé (3 colonnes, trame de
// séparateurs fins) — cf. bilan-document-model.html. Complète la dernière
// ligne avec des cellules vides pour garder la trame intacte.
export default function DocumentStatsGrid({ stats }: DocumentStatsGridProps) {
  const cellulesVides = (3 - (stats.length % 3)) % 3;

  return (
    <div className="mb-[28px] grid grid-cols-3 gap-px border border-[#e2e2e2] bg-[#e2e2e2]">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white px-5 py-[18px]">
          <div className="mb-[6px] text-[10px] tracking-[0.06em] text-[#999] uppercase">
            {stat.label}
          </div>
          <div className="font-jetbrains text-[19px] font-bold text-[#1a1a1a]">{stat.valeur}</div>
        </div>
      ))}
      {Array.from({ length: cellulesVides }).map((_, index) => (
        <div key={`vide-${index}`} className="bg-white" />
      ))}
    </div>
  );
}
