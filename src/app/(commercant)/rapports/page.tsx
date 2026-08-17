import { createClient } from "@/lib/supabase/server";
import { getRapportPeriode, type RapportPeriode } from "@/lib/rapports/queries";
import PrintButton from "@/components/ui/PrintButton";

type RapportsPageProps = {
  searchParams: Promise<{ debut?: string; fin?: string }>;
};

const RAPPORT_VIDE: RapportPeriode = {
  totalVentes: 0,
  totalDepenses: 0,
  soldeCaisse: 0,
  totalCreancesEnCours: 0,
};

function premierJourMoisEnCours(): string {
  const maintenant = new Date();
  return new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

function aujourdHui(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function RapportsPage({ searchParams }: RapportsPageProps) {
  const params = await searchParams;
  const debut = params.debut ?? premierJourMoisEnCours();
  const fin = params.fin ?? aujourdHui();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rapport = user
    ? await getRapportPeriode(user.id, debut, fin)
    : RAPPORT_VIDE;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold">Rapport</h1>
        <PrintButton />
      </div>

      <form method="get" className="mb-6 flex items-end gap-3 print:hidden">
        <label className="flex flex-col gap-1 text-sm">
          Du
          <input
            type="date"
            name="debut"
            defaultValue={debut}
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Au
          <input
            type="date"
            name="fin"
            defaultValue={fin}
            className="rounded border px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded bg-black px-3 py-2 text-white">
          Afficher
        </button>
      </form>

      <div className="rounded border p-8 text-black print:border-0 print:p-0">
        <p className="mb-6 text-sm text-zinc-600">
          Période du {debut} au {fin}
        </p>

        <dl className="grid grid-cols-2 gap-6">
          <div>
            <dt className="text-sm text-zinc-600">Total ventes</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalVentes.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-600">Total dépenses</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalDepenses.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-600">Solde de caisse</dt>
            <dd className="text-xl font-semibold">
              {rapport.soldeCaisse.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-600">Créances en cours</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalCreancesEnCours.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
