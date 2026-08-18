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

// Emoji vérifiés sur tresorerie-desktop-mockup.html (corrigé par Rahime).
const ONGLETS = [
  { valeur: "caisse", label: "💰 Ma Caisse" },
  { valeur: "poche", label: "👛 Ma Poche" },
  { valeur: "creances", label: "👥 Créances" },
] as const;
type Onglet = (typeof ONGLETS)[number]["valeur"];

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

// Un seul jeu de 3 onglets indépendants (Ma Caisse / Ma Poche / Créances),
// comportement identique desktop et mobile — plus de fusion "Poches".
export default function TresorerieTabs({
  commercant,
  mouvements,
  creances,
}: TresorerieTabsProps) {
  const [onglet, setOnglet] = useState<Onglet>("caisse");
  const devise = commercant?.devise ?? "FCFA";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-ink">Trésorerie</h1>

      <div className="flex gap-2 border-b border-line">
        {ONGLETS.map((item) => (
          <TabButton
            key={item.valeur}
            actif={onglet === item.valeur}
            onClick={() => setOnglet(item.valeur)}
          >
            {item.label}
          </TabButton>
        ))}
      </div>

      {onglet === "caisse" && (
        <PocheTresorerie
          typePoche="caisse"
          label="Ma Caisse"
          devise={devise}
          soldeInitial={commercant?.solde_initial_caisse ?? 0}
          mouvements={mouvements}
        />
      )}

      {onglet === "poche" && (
        <PocheTresorerie
          typePoche="poche"
          label="Ma Poche"
          devise={devise}
          soldeInitial={commercant?.solde_initial_poche ?? 0}
          mouvements={mouvements}
        />
      )}

      {onglet === "creances" && <CreanceList creances={creances} />}
    </div>
  );
}
