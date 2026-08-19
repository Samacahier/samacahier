"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteMyAccount } from "@/lib/commercants/account-actions";

const MOT_CONFIRMATION = "SUPPRIMER";

export default function SupprimerCompte() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (confirmation !== MOT_CONFIRMATION) {
      setErreur(`Tape "${MOT_CONFIRMATION}" pour confirmer.`);
      return;
    }

    setErreur(null);
    setLoading(true);

    const { error } = await deleteMyAccount();

    if (error) {
      setLoading(false);
      setErreur(error);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border-2 border-status-impaye bg-status-impaye-bg p-4">
      <h2 className="mb-1 font-semibold text-status-impaye">Supprimer mon compte</h2>
      <p className="mb-3 text-sm text-status-impaye">
        Action irréversible. Toutes vos données (ventes, dépenses, stock, créances, caisse)
        seront définitivement supprimées, sans possibilité de récupération.
      </p>

      <label className="mb-3 flex max-w-sm flex-col gap-1 text-sm text-status-impaye">
        Tape {MOT_CONFIRMATION} pour confirmer
        <input
          type="text"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="rounded-xl border border-status-impaye bg-card px-3 py-2 text-ink"
        />
      </label>

      {erreur && <p className="mb-3 text-sm text-status-impaye">{erreur}</p>}

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-xl bg-status-impaye px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Suppression..." : "Supprimer définitivement mon compte"}
      </button>
    </div>
  );
}
