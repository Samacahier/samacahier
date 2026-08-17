import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-gradient-to-b from-hero-start to-hero-deep py-20 text-center sm:py-[100px]">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <h2 className="font-display mx-auto mb-4 max-w-[22ch] text-[28px] font-bold text-card sm:text-[36px] lg:text-[42px]">
          Commencez à tenir vos comptes correctement, aujourd&apos;hui.
        </h2>
        <p className="mb-8 text-card/75">
          Gratuit pour démarrer. Aucune carte bancaire nécessaire.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-[15.5px] font-bold text-card shadow-[0_10px_24px_-10px_rgba(217,123,30,0.55)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_14px_28px_-10px_rgba(217,123,30,0.65)]"
        >
          Créer mon compte →
        </Link>
      </div>
    </section>
  );
}
