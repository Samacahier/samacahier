type BilanMensuelCardProps = {
  moisParDefaut: string;
};

export default function BilanMensuelCard({ moisParDefaut }: BilanMensuelCardProps) {
  return (
    <div className="rounded border p-4 print:hidden">
      <p className="mb-3 text-sm font-semibold text-zinc-600">BILAN MENSUEL EXPORTABLE</p>
      <form action="/rapports/bilan" method="get" className="flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Mois
          <input
            type="month"
            name="mois"
            defaultValue={moisParDefaut}
            className="rounded border px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Générer &amp; exporter le bilan
        </button>
      </form>
    </div>
  );
}
