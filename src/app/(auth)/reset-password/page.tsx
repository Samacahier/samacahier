"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);

    if (motDePasse !== confirmation) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Le lien reçu par e-mail établit déjà une session de récupération
    // (le client Supabase la détecte automatiquement dans l'URL au
    // chargement de la page) — updateUser s'applique à cette session.
    const { error } = await supabase.auth.updateUser({ password: motDePasse });

    if (error) {
      setLoading(false);
      setErreur(
        error.message.includes("session")
          ? "Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau."
          : error.message,
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Dernière étape"
      titre="Créer un nouveau mot de passe"
      sousTitre="Choisissez un nouveau mot de passe pour votre compte."
      brandTitre="Presque terminé."
      brandBullets={[
        { mark: "✓", texte: "Lien de réinitialisation vérifié" },
        { mark: "2", texte: "Choisissez votre nouveau mot de passe" },
      ]}
      footer=""
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Nouveau mot de passe
          <input
            type="password"
            required
            minLength={6}
            value={motDePasse}
            onChange={(event) => setMotDePasse(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Confirmer le mot de passe
          <input
            type="password"
            required
            minLength={6}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>

        {erreur && <p className="text-sm text-status-impaye">{erreur}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer et me connecter"}
        </button>
      </form>
    </AuthShell>
  );
}
