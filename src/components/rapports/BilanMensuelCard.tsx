type BilanMensuelCardProps = {
  moisParDefaut: string;
};

export default function BilanMensuelCard({ moisParDefaut }: BilanMensuelCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-hero-start to-hero-end p-4 text-white print:hidden">
      <p className="mb-3 text-xs font-medium tracking-wide text-white/70 uppercase">
        Bilan mensuel exportable
      </p>
      <form action="/rapports/bilan" method="get" className="flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-white/70">
          Mois
          <input
            type="month"
            name="mois"
            defaultValue={moisParDefaut}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          Générer &amp; exporter le bilan
        </button>
      </form>
    </div>
  );
}
