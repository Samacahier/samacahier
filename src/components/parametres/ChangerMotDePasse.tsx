"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

// Même mécanisme que "Mon compte" côté admin : updateUser client-side,
// après réauthentification pour vérifier l'ancien mot de passe.
export default function ChangerMotDePasse() {
  const [ancien, setAncien] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setMessage(null);

    if (nouveau !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setErreur("Session invalide.");
      setLoading(false);
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: ancien,
    });

    if (reauthError) {
      setErreur("Ancien mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: nouveau });

    setLoading(false);

    if (updateError) {
      setErreur(updateError.message);
      return;
    }

    setMessage("Mot de passe mis à jour.");
    setAncien("");
    setNouveau("");
    setConfirmation("");
  }

  return (
    <div className="rounded-2xl bg-card p-4">
      <h2 className="mb-3 font-semibold text-ink">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Ancien mot de passe
          <input
            type="password"
            required
            value={ancien}
            onChange={(event) => setAncien(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Nouveau mot de passe
          <input
            type="password"
            required
            minLength={6}
            value={nouveau}
            onChange={(event) => setNouveau(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Confirmer le nouveau mot de passe
          <input
            type="password"
            required
            minLength={6}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className={CHAMP}
          />
        </label>

        {erreur && <p className="text-sm text-status-impaye">{erreur}</p>}
        {message && <p className="text-sm text-status-paye">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-xl bg-accent px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
