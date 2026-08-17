"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const PROBLEMES = [
  {
    texte: "Un client qui doit de l'argent, et vous ne retrouvez plus la page.",
    delai: "0.05s",
  },
  {
    texte: "L'argent du commerce mélangé avec l'argent de la maison.",
    delai: "0.15s",
  },
  {
    texte: "Un stock qui part sans qu'on sache pourquoi la caisse est vide.",
    delai: "0.25s",
  },
];

function ProblemItem({ texte, delai }: { texte: string; delai: string }) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="reveal rounded-2xl border border-card/14 bg-card/6 p-6"
      style={{ transitionDelay: delai }}
    >
      <p className="text-[15.5px] text-card/70 line-through decoration-accent/70 decoration-2">
        {texte}
      </p>
    </div>
  );
}

export default function ProblemSection() {
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const pivotRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="mt-14 bg-gradient-to-b from-hero-start to-hero-deep py-16 sm:py-20">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <h2
          ref={titleRef}
          className="reveal font-display mb-10 max-w-[20ch] text-[26px] font-bold text-card sm:text-[32px] lg:text-[36px]"
        >
          Un cahier en papier, ça oublie autant que ça garde.
        </h2>

        <div className="mb-9 grid gap-6 sm:grid-cols-3">
          {PROBLEMES.map((probleme) => (
            <ProblemItem key={probleme.texte} texte={probleme.texte} delai={probleme.delai} />
          ))}
        </div>

        <div
          ref={pivotRef}
          className="reveal font-display flex items-center gap-3.5 text-xl font-bold text-card sm:text-2xl"
          style={{ transitionDelay: "0.3s" }}
        >
          <span className="h-0.5 w-8 bg-accent" />
          Sama Cahier tient les comptes à votre place.
        </div>
      </div>
    </section>
  );
}
