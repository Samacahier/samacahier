const LIENS_PRODUIT = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "/register", label: "Créer un compte" },
  { href: "/login", label: "Se connecter" },
];

export default function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-8">
      <div className="mx-auto max-w-[1160px] px-5 sm:px-7">
        <div className="grid grid-cols-1 gap-7 border-b border-ink/12 pb-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="font-display text-[22px] font-extrabold tracking-tight">
              Sama<span className="text-accent">·</span>Cahier
            </div>
            <p className="mt-3.5 max-w-[32ch] text-sm leading-relaxed text-ink-muted">
              Le cahier de votre commerce, toujours avec vous. Ventes,
              dépenses, stock, dettes et caisse — tout au même endroit.
            </p>
          </div>

          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 text-xs font-bold tracking-[0.06em] text-ink uppercase">
              Produit
            </div>
            {LIENS_PRODUIT.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                className="text-[14.5px] text-ink-muted transition-colors hover:text-accent-dark"
              >
                {lien.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-[11px]">
            <div className="mb-1 text-xs font-bold tracking-[0.06em] text-ink uppercase">
              Contact
            </div>
            <a
              href="mailto:contact@samacahier.sn"
              className="text-[14.5px] text-ink-muted transition-colors hover:text-accent-dark"
            >
              contact@samacahier.sn
            </a>
            <span className="text-[14.5px] text-ink-muted">Dakar, Sénégal</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 pt-6 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {annee} Sama Cahier. Tous droits réservés.</span>
          <span className="font-hand text-[19px] text-accent-dark">Tenu avec soin ✎</span>
        </div>
      </div>
    </footer>
  );
}
