"use client";

import { useState, type FormEvent } from "react";
import { resetCommercantPassword } from "@/lib/commercants/admin-actions";

type CommercantResetPasswordProps = {
  commercantId: string;
};

const CHAMP = "rounded-xl border border-line bg-page px-3 py-2 text-ink";

export default function CommercantResetPassword({
  commercantId,
}: CommercantResetPasswordProps) {
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setErreur(null);

    const { error } = await resetCommercantPassword(commercantId, nouveauMotDePasse);

    setLoading(false);
    if (error) {
      setErreur(error);
      return;
    }
    setMessage("Mot de passe réinitialisé. Communiquez-le au commerçant.");
    setNouveauMotDePasse("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nouveau mot de passe
        <input
          type="text"
          required
          minLength={6}
          value={nouveauMotDePasse}
          onChange={(event) => setNouveauMotDePasse(event.target.value)}
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
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </button>
    </form>
  );
}
