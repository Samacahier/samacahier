import { createClient } from "@/lib/supabase/server";
import {
  getRapportPeriode,
  getMargeBrute,
  getVentesParStatut,
  type RapportPeriode,
  type VentesParStatut,
} from "@/lib/rapports/queries";
import PrintButton from "@/components/ui/PrintButton";
import VentesParStatutSection from "@/components/rapports/VentesParStatutSection";

type BilanMensuelPageProps = {
  searchParams: Promise<{ mois?: string }>;
};

const RAPPORT_VIDE: RapportPeriode = {
  totalVentes: 0,
  totalDepenses: 0,
  soldeCaisse: 0,
  totalCreancesEnCours: 0,
};

const STATUTS_VIDE: VentesParStatut = {
  paye: { montant: 0, nombre: 0 },
  credit: { montant: 0, nombre: 0 },
  impaye: { montant: 0, nombre: 0 },
};

function moisEnCoursParDefaut(): string {
  return new Date().toISOString().slice(0, 7);
}

// Bornes [1er jour, dernier jour] du mois "YYYY-MM" donné.
function bornesDuMois(mois: string) {
  const [annee, moisNumero] = mois.split("-").map(Number);
  const debut = new Date(Date.UTC(annee, moisNumero - 1, 1)).toISOString().slice(0, 10);
  const fin = new Date(Date.UTC(annee, moisNumero, 0)).toISOString().slice(0, 10);
  return { debut, fin };
}

export default async function BilanMensuelPage({ searchParams }: BilanMensuelPageProps) {
  const params = await searchParams;
  const mois = params.mois ?? moisEnCoursParDefaut();
  const { debut, fin } = bornesDuMois(mois);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [rapport, margeBrute, ventesParStatut] = user
    ? await Promise.all([
        getRapportPeriode(user.id, debut, fin),
        getMargeBrute(user.id, debut, fin),
        getVentesParStatut(user.id, debut, fin),
      ])
    : [RAPPORT_VIDE, 0, STATUTS_VIDE];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold">Bilan mensuel</h1>
        <PrintButton />
      </div>

      <div className="rounded border p-8 text-black print:border-0 print:p-0">
        <p className="mb-6 text-sm text-zinc-600">Période : {mois}</p>

        <dl className="grid grid-cols-2 gap-6">
          <div>
            <dt className="text-sm text-zinc-600">Chiffre d&apos;affaires</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalVentes.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-600">Dépenses</dt>
            <dd className="text-xl font-semibold">
              {rapport.totalDepenses.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-600">Solde de caisse (mouvements du mois)</dt>
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
          <div>
            <dt className="text-sm text-zinc-600">Marge brute</dt>
            <dd className="text-xl font-semibold">
              {margeBrute.toLocaleString("fr-FR")} FCFA
            </dd>
          </div>
        </dl>
      </div>

      <VentesParStatutSection statuts={ventesParStatut} />
    </div>
  );
}
