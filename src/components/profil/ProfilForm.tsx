"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateCommercant } from "@/lib/commercants/queries";
import type { Commercant } from "@/types/database";

type ProfilFormProps = {
  commercant: Commercant;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

// Reprend exactement les champs de l'étape 2 de l'inscription
// (RegisterCommerceStep), en mode modifiable. Pas de champ devise ici —
// déplacé dans Paramètres.
export default function ProfilForm({ commercant }: ProfilFormProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [nomCommerce, setNomCommerce] = useState(commercant.nom_commerce);
  const [activite, setActivite] = useState(commercant.activite ?? "");
  const [ninea, setNinea] = useState(commercant.ninea ?? "");
  const [rccm, setRccm] = useState(commercant.rccm ?? "");
  const [telephonePro, setTelephonePro] = useState(commercant.telephone_pro ?? "");
  const [emailPro, setEmailPro] = useState(commercant.email_pro ?? "");
  const [adresse, setAdresse] = useState(commercant.adresse ?? "");
  const [villeRegion, setVilleRegion] = useState(commercant.ville_region ?? "");
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadLogo(): Promise<string | null> {
    if (!logo) return null;

    const supabase = createClient();
    const chemin = `${commercant.id}/${Date.now()}-${logo.name}`;
    const { error: uploadError } = await supabase.storage.from("logos").upload(chemin, logo);
    if (uploadError) return null;

    const { data } = supabase.storage.from("logos").getPublicUrl(chemin);
    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setInfo(null);

    const logoUrl = await uploadLogo();

    const { error } = await updateCommercant(commercant.id, {
      nom_commerce: nomCommerce,
      activite: activite || null,
      ninea: ninea || null,
      rccm: rccm || null,
      telephone_pro: telephonePro || null,
      email_pro: emailPro || null,
      adresse: adresse || null,
      ville_region: villeRegion || null,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
    });

    setLoading(false);
    setInfo(error ?? "Profil mis à jour.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Logo du commerce (facultatif)
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom du commerce
        <input
          type="text"
          required
          value={nomCommerce}
          onChange={(event) => setNomCommerce(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Activité
        <input
          type="text"
          value={activite}
          onChange={(event) => setActivite(event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          NINEA
          <input
            type="text"
            value={ninea}
            onChange={(event) => setNinea(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          RCCM
          <input
            type="text"
            value={rccm}
            onChange={(event) => setRccm(event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Téléphone du commerce
          <input
            type="tel"
            value={telephonePro}
            onChange={(event) => setTelephonePro(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          E-mail professionnel
          <input
            type="email"
            value={emailPro}
            onChange={(event) => setEmailPro(event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Adresse
        <input
          type="text"
          value={adresse}
          onChange={(event) => setAdresse(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Ville / Région
        <input
          type="text"
          value={villeRegion}
          onChange={(event) => setVilleRegion(event.target.value)}
          className={CHAMP}
        />
      </label>

      {info && <p className="text-sm text-ink-muted">{info}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-xl bg-accent px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
