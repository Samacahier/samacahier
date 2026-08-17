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

const ONGLETS = ["Ma Caisse", "Ma Poche", "Créances"] as const;
type Onglet = (typeof ONGLETS)[number];

export default function TresorerieTabs({
  commercant,
  mouvements,
  creances,
}: TresorerieTabsProps) {
  const [onglet, setOnglet] = useState<Onglet>("Ma Caisse");
  const devise = commercant?.devise ?? "FCFA";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Trésorerie</h1>

      <div className="flex gap-2 border-b">
        {ONGLETS.map((valeur) => (
          <button
            key={valeur}
            type="button"
            onClick={() => setOnglet(valeur)}
            className={`px-3 py-2 text-sm ${
              onglet === valeur
                ? "border-b-2 border-black font-semibold"
                : "text-zinc-500"
            }`}
          >
            {valeur}
          </button>
        ))}
      </div>

      {onglet === "Ma Caisse" && (
        <PocheTresorerie
          typePoche="caisse"
          label="Ma Caisse"
          devise={devise}
          soldeInitial={commercant?.solde_initial_caisse ?? 0}
          mouvements={mouvements}
        />
      )}

      {onglet === "Ma Poche" && (
        <PocheTresorerie
          typePoche="poche"
          label="Ma Poche"
          devise={devise}
          soldeInitial={commercant?.solde_initial_poche ?? 0}
          mouvements={mouvements}
        />
      )}

      {onglet === "Créances" && <CreanceList creances={creances} />}
    </div>
  );
}
