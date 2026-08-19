"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function ChangerMotDePasseForm() {
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setMessage(null);

    if (nouveauMotDePasse !== confirmation) {
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

    // Revérifie l'ancien mot de passe via une nouvelle authentification,
    // avant d'autoriser le changement (updateUser ne le redemande pas).
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: ancienMotDePasse,
    });

    if (reauthError) {
      setErreur("Ancien mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: nouveauMotDePasse,
    });

    setLoading(false);

    if (updateError) {
      setErreur(updateError.message);
      return;
    }

    setMessage("Mot de passe mis à jour.");
    setAncienMotDePasse("");
    setNouveauMotDePasse("");
    setConfirmation("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Ancien mot de passe
        <input
          type="password"
          required
          value={ancienMotDePasse}
          onChange={(event) => setAncienMotDePasse(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nouveau mot de passe
        <input
          type="password"
          required
          minLength={6}
          value={nouveauMotDePasse}
          onChange={(event) => setNouveauMotDePasse(event.target.value)}
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
  );
}
