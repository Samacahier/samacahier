"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/profiles/queries";
import type { Profile } from "@/types/database";

type AdminNotificationsFormProps = {
  profile: Profile;
};

type Cle = "notif_nouveau_commercant" | "notif_commercant_inactif" | "notif_resume_hebdo";

const OPTIONS: { cle: Cle; nom: string; description: string }[] = [
  {
    cle: "notif_nouveau_commercant",
    nom: "Nouveau commerçant inscrit",
    description: "Un e-mail à chaque nouvelle inscription",
  },
  {
    cle: "notif_commercant_inactif",
    nom: "Commerçant inactif",
    description: "Alerte après 14 jours sans activité",
  },
  {
    cle: "notif_resume_hebdo",
    nom: "Résumé hebdomadaire",
    description: "CA plateforme et activité, chaque lundi",
  },
];

export default function AdminNotificationsForm({ profile }: AdminNotificationsFormProps) {
  const [valeurs, setValeurs] = useState({
    notif_nouveau_commercant: profile.notif_nouveau_commercant,
    notif_commercant_inactif: profile.notif_commercant_inactif,
    notif_resume_hebdo: profile.notif_resume_hebdo,
  });

  async function basculer(cle: Cle) {
    const nouvelleValeur = !valeurs[cle];
    setValeurs((current) => ({ ...current, [cle]: nouvelleValeur }));

    const { error } = await updateProfile(profile.id, { [cle]: nouvelleValeur });
    if (error) {
      // Échec de sauvegarde : on revient à l'état précédent.
      setValeurs((current) => ({ ...current, [cle]: !nouvelleValeur }));
    }
  }

  return (
    <div>
      {OPTIONS.map(({ cle, nom, description }) => (
        <div key={cle} className="flex items-center justify-between border-b border-line py-3.5 last:border-b-0">
          <div>
            <p className="text-[13.5px] font-semibold text-ink">{nom}</p>
            <p className="mt-0.5 text-[11.5px] text-ink-muted">{description}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={valeurs[cle]}
            aria-label={nom}
            onClick={() => basculer(cle)}
            className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
              valeurs[cle] ? "bg-accent" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white transition-[left] ${
                valeurs[cle] ? "left-[18px]" : "left-[2px]"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
