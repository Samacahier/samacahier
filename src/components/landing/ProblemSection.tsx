const PROBLEMES = [
  "Un client qui doit de l'argent, et vous ne retrouvez plus la page.",
  "L'argent du commerce mélangé avec l'argent de la maison.",
  "Un stock qui part sans qu'on sache pourquoi la caisse est vide.",
];

export default function ProblemSection() {
  return (
    <section className="mt-14 bg-gradient-to-b from-hero-start to-hero-deep py-16 sm:py-20">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <h2 className="font-display mb-10 max-w-[20ch] text-[26px] font-bold text-card sm:text-[32px] lg:text-[36px]">
          Un cahier en papier, ça oublie autant que ça garde.
        </h2>

        <div className="mb-9 grid gap-6 sm:grid-cols-3">
          {PROBLEMES.map((probleme) => (
            <div
              key={probleme}
              className="rounded-2xl border border-card/14 bg-card/6 p-6"
            >
              <p className="text-[15.5px] text-card/70 line-through decoration-accent/70 decoration-2">
                {probleme}
              </p>
            </div>
          ))}
        </div>

        <div className="font-display flex items-center gap-3.5 text-xl font-bold text-card sm:text-2xl">
          <span className="h-0.5 w-8 bg-accent" />
          Sama Cahier tient les comptes à votre place.
        </div>
      </div>
    </section>
  );
}
