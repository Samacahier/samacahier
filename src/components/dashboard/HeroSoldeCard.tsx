type HeroSoldeCardProps = {
  devise: string;
  soldeCaisse: number;
  soldePoche: number;
};

export default function HeroSoldeCard({ devise, soldeCaisse, soldePoche }: HeroSoldeCardProps) {
  const soldeTotal = soldeCaisse + soldePoche;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-hero-start to-hero-end p-6 text-white">
      <p className="text-sm text-white/70">SOLDE DISPONIBLE TOTAL</p>
      <p className="text-4xl font-semibold">
        {soldeTotal.toLocaleString("fr-FR")} {devise}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/20 pt-4 text-sm">
        <div>
          <p className="text-white/70">Ma Caisse</p>
          <p className="font-medium">{soldeCaisse.toLocaleString("fr-FR")}</p>
        </div>
        <div>
          <p className="text-white/70">Ma Poche</p>
          <p className="font-medium">{soldePoche.toLocaleString("fr-FR")}</p>
        </div>
      </div>
    </div>
  );
}
