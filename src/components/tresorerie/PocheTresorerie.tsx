"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SoldeCard from "./SoldeCard";
import MouvementModal from "./MouvementModal";
import MouvementsDirectsList from "./MouvementsDirectsList";
import type { Caisse } from "@/types/database";

type PocheTresorerieProps = {
  typePoche: Caisse["type_poche"];
  label: string;
  devise: string;
  soldeInitial: number;
  mouvements: Caisse[];
};

export default function PocheTresorerie({
  typePoche,
  label,
  devise,
  soldeInitial,
  mouvements,
}: PocheTresorerieProps) {
  const router = useRouter();
  const [modaleOuverte, setModaleOuverte] = useState<Caisse["type_mouvement"] | null>(
    null,
  );

  const mouvementsPoche = mouvements.filter((m) => m.type_poche === typePoche);
  const entrees = mouvementsPoche
    .filter((m) => m.type_mouvement === "entree")
    .reduce((somme, m) => somme + m.montant, 0);
  const sorties = mouvementsPoche
    .filter((m) => m.type_mouvement === "sortie")
    .reduce((somme, m) => somme + m.montant, 0);

  const mouvementsDirects = mouvementsPoche.filter(
    (m) => !m.vente_id && !m.depense_id,
  );

  function handleSuccess() {
    setModaleOuverte(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <SoldeCard
        devise={devise}
        soldeInitial={soldeInitial}
        entrees={entrees}
        sorties={sorties}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setModaleOuverte("entree")}
          className="flex-1 rounded bg-accent px-3 py-2 text-white"
        >
          Faire entrer
        </button>
        <button
          type="button"
          onClick={() => setModaleOuverte("sortie")}
          className="flex-1 rounded bg-secondary px-3 py-2 text-ink"
        >
          Sortir
        </button>
      </div>

      <MouvementsDirectsList mouvements={mouvementsDirects} />

      {modaleOuverte && (
        <MouvementModal
          typePoche={typePoche}
          typeMouvement={modaleOuverte}
          labelPoche={label}
          onClose={() => setModaleOuverte(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
