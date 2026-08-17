"use client";

import Link from "next/link";
import PhoneMockup from "./PhoneMockup";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Hero() {
  const textRef = useScrollReveal<HTMLDivElement>();
  const phoneRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="pt-12 pb-10 sm:pt-[76px]">
      <div className="mx-auto grid max-w-[1160px] items-center gap-10 px-5 sm:px-7 md:grid-cols-[1fr_2px_1fr] md:gap-14">
        <div ref={textRef} className="reveal">
          <div className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] text-accent-dark uppercase">
            <span className="h-[7px] w-[7px] rounded-full bg-accent" />
            Pensé pour les commerçants sénégalais
          </div>

          <h1 className="font-display mb-5 text-[34px] leading-[1.05] font-bold tracking-tight sm:text-[44px] lg:text-[54px]">
            Le cahier de votre commerce ne se{" "}
            <span className="text-accent-dark">perd</span> plus.
          </h1>

          <p className="mb-8 max-w-[46ch] text-lg text-ink-muted">
            Ventes, dépenses, stock, dettes et caisse — tout ce que vous
            notiez à la main, maintenant fiable et toujours avec vous.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-[15.5px] font-bold text-card shadow-[0_10px_24px_-10px_rgba(217,123,30,0.55)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_14px_28px_-10px_rgba(217,123,30,0.65)]"
            >
              Créer mon compte →
            </Link>
            <a
              href="#fonctionnalites"
              className="border-b-[1.5px] border-ink pb-0.5 text-[15px] font-semibold"
            >
              Voir comment ça marche
            </a>
          </div>
        </div>

        <div
          aria-hidden
          className="hidden w-0.5 self-stretch bg-[radial-gradient(circle,var(--color-ink)_2.4px,transparent_3px)] bg-repeat-y opacity-[0.28] [background-position:center_top] [background-size:100%_24px] md:block"
        />

        <div ref={phoneRef} className="reveal relative" style={{ transitionDelay: "0.15s" }}>
          <span className="font-hand absolute -top-4 left-2 -rotate-6 text-xl font-bold text-accent-dark">
            en 2 minutes ✎
          </span>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
