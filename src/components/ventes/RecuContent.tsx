import type { Vente } from "@/types/database";

export type RecuData = {
  nomCommerce: string;
  telephone: string | null;
  adresse: string | null;
  activite: string | null;
  clientNom: string;
  vente: Vente;
};

const MODE_PAIEMENT_LABELS: Record<string, string> = {
  especes: "Espèces",
  mobile_money: "Mobile money",
  virement: "Virement",
  autre: "Autre",
};

const STATUT_LABELS: Record<Vente["statut"], string> = {
  paye: "PAYÉ",
  credit: "CRÉDIT",
  impaye: "IMPAYÉ",
};

function formaterMontant(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} F`;
}

// Contenu du reçu : fond blanc, texte noir, police monospace — reproduit
// fidèlement le prototype thermique de Binetou, indépendant de la palette
// du reste de l'app. Utilisé par la modale d'aperçu et par la page
// /ventes/[id]/recu (lien de partage).
export default function RecuContent({ nomCommerce, telephone, adresse, activite, clientNom, vente }: RecuData) {
  const sousTotal = vente.quantite * vente.prix_unitaire;
  const montantEncaisse = vente.montant_encaisse ?? 0;
  const resteAPayer = Math.max(0, vente.montant_total - montantEncaisse);

  return (
    <div
      id="recu-imprimable"
      className="mx-auto w-full max-w-[300px] bg-white p-4 font-mono text-[11px] leading-snug text-black"
    >
      <p className="text-center font-bold uppercase">{nomCommerce}</p>
      {telephone && <p className="text-center">{telephone}</p>}
      {adresse && <p className="text-center uppercase">{adresse}</p>}
      {activite && <p className="text-center uppercase">{activite}</p>}

      <div className="my-2 border-t border-black" />

      <p className="text-center font-bold">REÇU DE VENTE</p>
      <div className="h-2" />

      <div className="flex justify-between">
        <span>N° {vente.code_vente}</span>
        <span>{vente.date_vente}</span>
      </div>
      <p>Client : {clientNom}</p>
      <div className="h-2" />

      <div className="grid grid-cols-[1fr_2rem_3.5rem_3.5rem] gap-1 border-b border-black pb-1 font-bold">
        <span>PRODUIT</span>
        <span className="text-right">QTÉ</span>
        <span className="text-right">PRIX</span>
        <span className="text-right">TOTAL</span>
      </div>
      <div className="grid grid-cols-[1fr_2rem_3.5rem_3.5rem] gap-1">
        <span>{vente.description}</span>
        <span className="text-right">{vente.quantite}</span>
        <span className="text-right">{formaterMontant(vente.prix_unitaire)}</span>
        <span className="text-right">{formaterMontant(vente.montant_total)}</span>
      </div>
      <div className="h-2" />

      <div className="flex justify-between">
        <span>Sous-total</span>
        <span>{formaterMontant(sousTotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Remise</span>
        <span>{formaterMontant(vente.remise)}</span>
      </div>
      <div className="my-1 border-t border-black" />
      <div className="flex justify-between text-sm font-bold">
        <span>TOTAL À PAYER</span>
        <span>{formaterMontant(vente.montant_total)}</span>
      </div>
      <div className="flex justify-between">
        <span>Montant encaissé</span>
        <span>{formaterMontant(montantEncaisse)}</span>
      </div>
      <div className="flex justify-between">
        <span>Reste à payer</span>
        <span>{formaterMontant(resteAPayer)}</span>
      </div>
      <div className="flex justify-between">
        <span>Mode de paiement</span>
        <span>{MODE_PAIEMENT_LABELS[vente.mode_paiement] ?? vente.mode_paiement}</span>
      </div>
      <div className="h-3" />

      <div className="flex justify-center">
        <div className="border border-black px-4 py-1 font-bold">
          {STATUT_LABELS[vente.statut]}
        </div>
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <p className="text-center">Merci pour votre confiance !</p>
      <div className="h-2" />
      <p className="text-center text-[10px] text-gray-500">Géré avec Sama Cahier</p>
    </div>
  );
}
