type DocumentTitreProps = {
  titre: string;
  sousTitre: string;
};

export default function DocumentTitre({ titre, sousTitre }: DocumentTitreProps) {
  return (
    <div>
      <p className="font-display mb-[2px] text-[19px] font-bold text-[#1a1a1a]">{titre}</p>
      <p className="mb-[26px] text-[12.5px] text-[#888]">{sousTitre}</p>
    </div>
  );
}
