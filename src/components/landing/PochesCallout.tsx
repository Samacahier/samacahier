"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PochesCallout() {
  const textRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="pt-5 pb-16 sm:pb-[90px]">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <div className="grid items-center gap-10 rounded-[24px] border border-ink/12 bg-card p-8 sm:p-14 lg:grid-cols-2">
          <div ref={textRef} className="reveal">
            <div className="mb-3 text-[13px] font-semibold tracking-[0.08em] text-accent-dark uppercase">
              Le vrai problème, réglé
            </div>
            <h2 className="font-display mb-4 text-2xl font-bold sm:text-[30px]">
              Votre argent perso n&apos;est plus mélangé au commerce.
            </h2>
            <p className="max-w-[42ch] text-[15.5px] text-ink-muted">
              Ma Caisse pour le commerce, Ma Poche pour le personnel. Chaque
              vente, chaque dépense va dans la bonne poche — vous savez enfin
              ce qui vous appartient.
            </p>
          </div>

          <div
            ref={cardsRef}
            className="reveal flex gap-4"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-hero-start to-hero-deep p-5 text-card">
              <div className="mb-2 text-xs tracking-[0.06em] text-card/80 uppercase">
                Ma Caisse
              </div>
              <div className="font-jetbrains text-[15px] font-bold">50 000 F</div>
            </div>
            <div className="flex-1 rounded-2xl bg-accent-dark p-5 text-card">
              <div className="mb-2 text-xs tracking-[0.06em] text-card/80 uppercase">
                Ma Poche
              </div>
              <div className="font-jetbrains text-[15px] font-bold">15 000 F</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
