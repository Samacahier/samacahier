import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCommercant } from "@/lib/commercants/queries";
import {
  getRapportPeriode,
  getMargeBrute,
  getVentesParStatut,
  type RapportPeriode,
  type VentesParStatut,
} from "@/lib/rapports/queries";
import PrintButton from "@/components/ui/PrintButton";
import DocumentImprimable from "@/components/rapports/document/DocumentImprimable";
import DocumentEntete from "@/components/rapports/document/DocumentEntete";
import DocumentTitre from "@/components/rapports/document/DocumentTitre";
import DocumentStatsGrid from "@/components/rapports/document/DocumentStatsGrid";
import DocumentPied from "@/components/rapports/document/DocumentPied";
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

function formaterMoisLabel(mois: string): string {
  const [annee, moisNumero] = mois.split("-").map(Number);
  const label = new Date(Date.UTC(annee, moisNumero - 1, 1)).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formaterMontant(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

export default async function BilanMensuelPage({ searchParams }: BilanMensuelPageProps) {
  const params = await searchParams;
  const mois = params.mois ?? moisEnCoursParDefaut();
  const { debut, fin } = bornesDuMois(mois);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [rapport, margeBrute, ventesParStatut, commercant] = user
    ? await Promise.all([
        getRapportPeriode(user.id, debut, fin),
        getMargeBrute(user.id, debut, fin),
        getVentesParStatut(user.id, debut, fin),
        getCommercant(user.id),
      ])
    : [RAPPORT_VIDE, 0, STATUTS_VIDE, null];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <Link
        href="/rapports"
        className="flex w-fit items-center gap-1 text-sm text-ink-muted hover:text-ink print:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold text-ink">Bilan mensuel</h1>
        <PrintButton />
      </div>

      <DocumentImprimable id="bilan-imprimable">
        <DocumentEntete
          nomCommerce={commercant?.nom_commerce ?? "Commerce"}
          activite={commercant?.activite ?? null}
          ville={commercant?.ville_region ?? null}
          telephone={commercant?.telephone ?? null}
          genereLe={new Date()}
        />

        <DocumentTitre titre="Bilan mensuel" sousTitre={`Période : ${formaterMoisLabel(mois)}`} />

        <DocumentStatsGrid
          stats={[
            { label: "Chiffre d'affaires", valeur: formaterMontant(rapport.totalVentes) },
            { label: "Dépenses", valeur: formaterMontant(rapport.totalDepenses) },
            { label: "Solde de caisse", valeur: formaterMontant(rapport.soldeCaisse) },
            { label: "Créances en cours", valeur: formaterMontant(rapport.totalCreancesEnCours) },
            { label: "Marge brute", valeur: formaterMontant(margeBrute) },
          ]}
        />

        <VentesParStatutSection statuts={ventesParStatut} />

        <DocumentPied />
      </DocumentImprimable>
    </div>
  );
}
