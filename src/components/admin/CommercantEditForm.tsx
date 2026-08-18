"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateCommercantInfos } from "@/lib/commercants/admin-actions";

type CommercantEditFormProps = {
  commercantId: string;
  nomCommerce: string;
  activite: string | null;
};

const CHAMP = "rounded-xl border border-line bg-page px-3 py-2 text-ink";

export default function CommercantEditForm({
  commercantId,
  nomCommerce,
  activite,
}: CommercantEditFormProps) {
  const router = useRouter();
  const [nom, setNom] = useState(nomCommerce);
  const [act, setAct] = useState(activite ?? "");
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setInfo(null);

    const { error } = await updateCommercantInfos(commercantId, {
      nom_commerce: nom,
      activite: act || null,
    });

    setLoading(false);
    setInfo(error ?? "Infos mises à jour.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom du commerce
        <input
          type="text"
          required
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Activité
        <input
          type="text"
          value={act}
          onChange={(event) => setAct(event.target.value)}
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
