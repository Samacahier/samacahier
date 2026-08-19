type DocumentEnteteProps = {
  nomCommerce: string;
  activite: string | null;
  ville: string | null;
  telephone: string | null;
  genereLe: Date;
};

function formaterDateHeure(date: Date): string {
  const jour = date.toLocaleDateString("fr-FR");
  const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${jour} à ${heure}`;
}

// En-tête d'identité commune aux documents imprimés (marque + date de
// génération, puis nom et coordonnées du commerce) — cf.
// bilan-document-model.html.
export default function DocumentEntete({
  nomCommerce,
  activite,
  ville,
  telephone,
  genereLe,
}: DocumentEnteteProps) {
  const meta = [activite, ville].filter(Boolean).join(" · ");

  return (
    <div>
      <div className="mb-[28px] flex items-start justify-between border-b-2 border-[#1a1a1a] pb-[18px]">
        <span className="font-jetbrains text-[11px] tracking-[0.05em] text-[#999]">
          SAMA·CAHIER
        </span>
        <span className="text-right text-[10.5px] text-[#888]">
          Généré le {formaterDateHeure(genereLe)}
        </span>
      </div>

      <p className="font-display mb-[4px] text-[24px] font-extrabold text-[#1a1a1a]">
        {nomCommerce}
      </p>
      <div className="mb-[26px] text-[12.5px] leading-[1.6] text-[#666]">
        {meta && <p>{meta}</p>}
        {telephone && <p>{telephone}</p>}
      </div>
    </div>
  );
}
