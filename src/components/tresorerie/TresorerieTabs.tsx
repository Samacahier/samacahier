"use client";

import { useState } from "react";
import PocheTresorerie from "./PocheTresorerie";
import CreanceList from "@/components/creances/CreanceList";
import type { Caisse, Creance, Commercant } from "@/types/database";

type TresorerieTabsProps = {
  commercant: Commercant | null;
  mouvements: Caisse[];
  creances: Creance[];
};

const ONGLETS_MOBILE = ["Ma Caisse", "Ma Poche", "Créances"] as const;
type OngletMobile = (typeof ONGLETS_MOBILE)[number];

const ONGLETS_DESKTOP = ["Poches", "Créances"] as const;
type OngletDesktop = (typeof ONGLETS_DESKTOP)[number];

function TabButton({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-sm ${
        actif ? "border-b-2 border-accent font-semibold text-accent" : "text-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}

export default function TresorerieTabs({
  commercant,
  mouvements,
  creances,
}: TresorerieTabsProps) {
  const [ongletMobile, setOngletMobile] = useState<OngletMobile>("Ma Caisse");
  const [ongletDesktop, setOngletDesktop] = useState<OngletDesktop>("Poches");
  const devise = commercant?.devise ?? "FCFA";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-ink">Trésorerie</h1>

      {/* Mobile / tablette (<1024px) : onglets Ma Caisse / Ma Poche / Créances, inchangé */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex gap-2 border-b border-line">
          {ONGLETS_MOBILE.map((valeur) => (
            <TabButton
              key={valeur}
              actif={ongletMobile === valeur}
              onClick={() => setOngletMobile(valeur)}
            >
              {valeur}
            </TabButton>
          ))}
        </div>

        {ongletMobile === "Ma Caisse" && (
          <PocheTresorerie
            typePoche="caisse"
            label="Ma Caisse"
            devise={devise}
            soldeInitial={commercant?.solde_initial_caisse ?? 0}
            mouvements={mouvements}
          />
        )}

        {ongletMobile === "Ma Poche" && (
          <PocheTresorerie
            typePoche="poche"
            label="Ma Poche"
            devise={devise}
            soldeInitial={commercant?.solde_initial_poche ?? 0}
            mouvements={mouvements}
          />
        )}

        {ongletMobile === "Créances" && <CreanceList creances={creances} />}
      </div>

      {/* Desktop (≥1024px) : Ma Caisse et Ma Poche côte à côte, Créances à part */}
      <div className="hidden flex-col gap-4 lg:flex">
        <div className="flex gap-2 border-b border-line">
          {ONGLETS_DESKTOP.map((valeur) => (
            <TabButton
              key={valeur}
              actif={ongletDesktop === valeur}
              onClick={() => setOngletDesktop(valeur)}
            >
              {valeur}
            </TabButton>
          ))}
        </div>

        {ongletDesktop === "Poches" ? (
          <div className="grid grid-cols-2 gap-6">
            <PocheTresorerie
              typePoche="caisse"
              label="Ma Caisse"
              devise={devise}
              soldeInitial={commercant?.solde_initial_caisse ?? 0}
              mouvements={mouvements}
            />
            <PocheTresorerie
              typePoche="poche"
              label="Ma Poche"
              devise={devise}
              soldeInitial={commercant?.solde_initial_poche ?? 0}
              mouvements={mouvements}
            />
          </div>
        ) : (
          <CreanceList creances={creances} />
        )}
      </div>
    </div>
  );
}
