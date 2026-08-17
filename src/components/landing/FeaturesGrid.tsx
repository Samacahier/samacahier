const FEATURES = [
  {
    num: "01",
    titre: "Ventes",
    texte: "Chaque vente enregistrée — payée, à crédit ou impayée.",
  },
  {
    num: "02",
    titre: "Dépenses",
    texte: "Ce qui sort, et d'où : caisse du commerce ou poche personnelle.",
  },
  {
    num: "03",
    titre: "Stock",
    texte: "Ce qu'il vous reste, avant qu'il ne soit trop tard.",
  },
  {
    num: "04",
    titre: "Créances",
    texte: "Qui vous doit quoi, et depuis quand.",
  },
  {
    num: "05",
    titre: "Caisse",
    texte: "Deux poches séparées, jamais mélangées.",
  },
  {
    num: "06",
    titre: "Tableaux de bord",
    texte: "L'état réel de votre commerce, en un coup d'œil.",
  },
  {
    num: "07",
    titre: "Documents",
    texte: "Reçus et rapports prêts à imprimer ou partager.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="fonctionnalites" className="py-16 sm:py-[88px]">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <div className="mb-12 max-w-[56ch]">
          <div className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-accent-dark uppercase">
            Ce que vous pouvez faire
          </div>
          <h2 className="font-display text-[26px] font-bold sm:text-[30px] lg:text-[34px]">
            Tout ce qu&apos;un commerce doit suivre, au même endroit.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.num} className="flex min-h-[168px] flex-col gap-2.5 bg-card p-6">
              <span className="font-jetbrains text-xs font-bold text-accent-dark">
                {feature.num}
              </span>
              <h3 className="text-[16.5px] font-bold">{feature.titre}</h3>
              <p className="text-[13.5px] text-ink-muted">{feature.texte}</p>
            </div>
          ))}
          <div className="flex min-h-[168px] flex-col justify-center gap-2.5 bg-secondary p-6">
            <p className="text-[14.5px] font-semibold text-ink">
              Pensé pour être utilisé sans formation comptable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
