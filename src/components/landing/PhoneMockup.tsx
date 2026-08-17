// Recréation statique de l'écran Accueil, pour l'illustration marketing —
// pas branchée sur de vraies données.
export default function PhoneMockup() {
  return (
    <div className="mx-auto w-[250px] rounded-[34px] bg-[#17110B] p-3 shadow-[0_30px_60px_-20px_rgba(45,38,22,0.45)] sm:w-[290px]">
      <div className="flex h-[490px] flex-col overflow-hidden rounded-[24px] bg-page">
        <div className="flex justify-between px-5 pt-3.5 pb-1 text-xs font-semibold">
          <span>12:41</span>
          <span>●●●●</span>
        </div>

        <div className="flex-1 overflow-hidden px-4 pt-2 pb-[18px]">
          <div className="mb-2.5 rounded-[18px] bg-gradient-to-br from-hero-start to-hero-deep p-4 text-card">
            <div className="mb-1 text-[10px] tracking-[0.08em] text-card/70 uppercase">
              Solde disponible total
            </div>
            <div className="font-jetbrains mb-2 text-2xl font-bold">65 000 F</div>
            <div className="flex gap-4 text-[11px] text-card/85">
              <div>
                Ma Caisse
                <strong className="font-jetbrains mt-0.5 block text-[13px]">
                  50 000 F
                </strong>
              </div>
              <div>
                Ma Poche
                <strong className="font-jetbrains mt-0.5 block text-[13px]">
                  15 000 F
                </strong>
              </div>
            </div>
          </div>

          <div className="mb-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-card px-3 py-2.5">
              <div className="text-[9px] tracking-[0.05em] text-ink-muted uppercase">
                Chiffre d&apos;affaires
              </div>
              <div className="font-jetbrains mt-0.5 text-sm font-bold">0 F</div>
            </div>
            <div className="rounded-xl bg-card px-3 py-2.5">
              <div className="text-[9px] tracking-[0.05em] text-ink-muted uppercase">
                Créances
              </div>
              <div className="font-jetbrains mt-0.5 text-sm font-bold">0 F</div>
            </div>
          </div>

          <div className="mb-3 flex gap-2">
            <div className="flex-1 rounded-lg bg-accent py-2.5 text-center text-xs font-bold text-card">
              Nouvelle vente
            </div>
            <div className="flex-1 rounded-lg bg-secondary py-2.5 text-center text-xs font-bold text-ink">
              Dépense
            </div>
          </div>

          <div className="mb-2 text-[11px] font-bold text-ink-muted">
            DERNIÈRES OPÉRATIONS
          </div>
          <div className="mb-1.5 flex justify-between rounded-lg bg-card px-3 py-2.5 text-[11.5px]">
            <span>Vente — Riz 5kg</span>
            <span className="font-jetbrains font-bold">+3 500 F</span>
          </div>
          <div className="flex justify-between rounded-lg bg-card px-3 py-2.5 text-[11.5px]">
            <span>Dépense — Transport</span>
            <span className="font-jetbrains font-bold text-status-impaye">
              −1 000 F
            </span>
          </div>

          <div className="mt-2.5 flex justify-around border-t border-ink/12 pt-2.5 text-[9px] font-semibold text-ink-muted">
            <span className="text-accent-dark">Accueil</span>
            <span>Vente</span>
            <span>Dépenses</span>
            <span>Stock</span>
            <span>Plus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
