"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { demanderReinitialisationMotDePasse } from "@/lib/auth/reset-password";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await demanderReinitialisationMotDePasse(email);
    setLoading(false);
    setEnvoye(true);
  }

  return (
    <AuthShell
      eyebrow="Mot de passe oublié"
      titre="Réinitialiser votre mot de passe"
      sousTitre="Entrez l'adresse e-mail de votre compte. Vous recevrez un lien pour créer un nouveau mot de passe."
      brandTitre="Ça arrive à tout le monde."
      brandBullets={[
        { mark: "1", texte: "Entrez votre adresse e-mail" },
        { mark: "2", texte: "Ouvrez le lien reçu" },
        { mark: "✓", texte: "Choisissez un nouveau mot de passe" },
      ]}
      footer={
        <Link href="/login" className="font-semibold text-accent-dark underline">
          ← Retour à la connexion
        </Link>
      }
    >
      {envoye ? (
        <p className="rounded-xl border border-status-paye bg-status-paye-bg px-4 py-3 text-sm text-status-paye">
          Si un compte existe avec cette adresse, un e-mail avec le lien de réinitialisation vient
          d&apos;être envoyé.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-ink-muted">
            Adresse e-mail
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent px-3 py-2 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
