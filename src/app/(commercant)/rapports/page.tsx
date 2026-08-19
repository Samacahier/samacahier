import { createClient } from "@/lib/supabase/server";
import { getCommercant } from "@/lib/commercants/queries";
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
import DocumentImprimable from "@/components/rapports/document/DocumentImprimable";
import DocumentEntete from "@/components/rapports/document/DocumentEntete";
import DocumentTitre from "@/components/rapports/document/DocumentTitre";
import DocumentStatsGrid from "@/components/rapports/document/DocumentStatsGrid";
import DocumentPied from "@/components/rapports/document/DocumentPied";

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

function formaterMontant(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

function formaterDateFr(dateIso: string): string {
  const [annee, mois, jour] = dateIso.split("-");
  return `${jour}/${mois}/${annee}`;
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

  const [rapport, apercuGlobal, ventesParStatut, commercant] = user
    ? await Promise.all([
        getRapportPeriode(user.id, debut, fin),
        getApercuGlobal(user.id),
        getVentesParStatut(user.id, debut, fin),
        getCommercant(user.id),
      ])
    : [RAPPORT_VIDE, APERCU_VIDE, STATUTS_VIDE, null];

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 lg:max-w-[1440px] lg:px-14 lg:py-12">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold text-ink">Rapport</h1>
        <PrintButton />
      </div>

      <div className="print:hidden">
        <BilanMensuelCard moisParDefaut={moisEnCours} />
      </div>

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

      <DocumentImprimable id="rapport-imprimable">
        <DocumentEntete
          nomCommerce={commercant?.nom_commerce ?? "Commerce"}
          activite={commercant?.activite ?? null}
          ville={commercant?.ville_region ?? null}
          telephone={commercant?.telephone ?? null}
          genereLe={new Date()}
        />

        <DocumentTitre
          titre="Rapport de période"
          sousTitre={`Du ${formaterDateFr(debut)} au ${formaterDateFr(fin)}`}
        />

        <DocumentStatsGrid
          stats={[
            { label: "Chiffre d'affaires", valeur: formaterMontant(rapport.totalVentes) },
            { label: "Dépenses", valeur: formaterMontant(rapport.totalDepenses) },
            { label: "Solde de caisse", valeur: formaterMontant(rapport.soldeCaisse) },
            { label: "Créances en cours", valeur: formaterMontant(rapport.totalCreancesEnCours) },
          ]}
        />

        <div className="mb-[28px]">
          <ApercuGlobalSection
            chiffreAffaires={apercuGlobal.chiffreAffaires}
            totalDepenses={apercuGlobal.totalDepenses}
            totalCreancesEnCours={apercuGlobal.totalCreancesEnCours}
            margeBrute={apercuGlobal.margeBrute}
          />
        </div>

        <VentesParStatutSection statuts={ventesParStatut} />

        <DocumentPied />
      </DocumentImprimable>
    </main>
  );
}
