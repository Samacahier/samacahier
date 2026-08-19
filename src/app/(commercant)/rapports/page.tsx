import { createClient } from "@/lib/supabase/server";
import {
  getRapportPeriode,
  getApercuGlobal,
  getVentesParStatut,
  type RapportPeriode,
  type ApercuGlobal,
  type VentesParStatut,
} from "@/lib/rapports/queries";
import PrintButton from "@/components/ui/PrintButton";
import BilanMensuelCard from "@/components/rapports/BilanMensuelCard";
import ApercuGlobalSection from "@/components/rapports/ApercuGlobalSection";
import VentesParStatutSection from "@/components/rapports/VentesParStatutSection";

type RapportsPageProps = {
  searchParams: Promise<{ debut?: string; fin?: string }>;
};

const RAPPORT_VIDE: RapportPeriode = {
  totalVentes: 0,
  totalDepenses: 0,
  soldeCaisse: 0,
  totalCreancesEnCours: 0,
};

const APERCU_VIDE: ApercuGlobal = {
  chiffreAffaires: 0,
  totalDepenses: 0,
  totalCreancesEnCours: 0,
  margeBrute: 0,
};

const STATUTS_VIDE: VentesParStatut = {
  paye: { montant: 0, nombre: 0 },
  credit: { montant: 0, nombre: 0 },
  impaye: { montant: 0, nombre: 0 },
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
  const moisEnCours = aujourdHui().slice(0, 7);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [rapport, apercuGlobal, ventesParStatut] = user
    ? await Promise.all([
        getRapportPeriode(user.id, debut, fin),
        getApercuGlobal(user.id),
        getVentesParStatut(user.id, debut, fin),
      ])
    : [RAPPORT_VIDE, APERCU_VIDE, STATUTS_VIDE];

  return (
    <main
      id="rapport-imprimable"
      className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12"
    >
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold text-ink">Rapport</h1>
        <PrintButton />
      </div>

      <BilanMensuelCard moisParDefaut={moisEnCours} />

      <form method="get" className="flex items-end gap-3 print:hidden">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Du
          <input
            type="date"
            name="debut"
            defaultValue={debut}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Au
          <input
            type="date"
            name="fin"
            defaultValue={fin}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          Afficher
        </button>
      </form>

      <div className="rounded-2xl bg-card p-8 text-ink print:border print:border-line print:bg-white print:p-6">
        <p className="mb-6 text-sm text-ink-muted">
          Période du {debut} au {fin}
        </p>

        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-ink-muted">Total ventes</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalVentes.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Total dépenses</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalDepenses.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Solde de caisse</dt>
            <dd className="text-xl font-semibold">
              {rapport.soldeCaisse.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Créances en cours</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalCreancesEnCours.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
        </dl>
      </div>

      <VentesParStatutSection statuts={ventesParStatut} />

      <ApercuGlobalSection
        chiffreAffaires={apercuGlobal.chiffreAffaires}
        totalDepenses={apercuGlobal.totalDepenses}
        totalCreancesEnCours={apercuGlobal.totalCreancesEnCours}
        margeBrute={apercuGlobal.margeBrute}
      />
    </main>
  );
}
