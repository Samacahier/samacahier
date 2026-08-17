"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Connexion impossible.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.role === "admin" ? "/admin/dashboard" : "/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Content de vous revoir"
      titre="Connexion"
      sousTitre="Retrouvez votre commerce et vos données."
      brandTitre="Le cahier de votre commerce ne se perd plus."
      brandBullets={[
        { mark: "✓", texte: "Vos ventes, dépenses et stock, au même endroit" },
        { mark: "✓", texte: "Vos données réservées à votre commerce" },
        { mark: "✓", texte: "Accessible depuis n'importe quel téléphone" },
      ]}
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold text-accent-dark underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Mot de passe
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          />
        </label>

        {error && <p className="text-sm text-status-impaye">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </AuthShell>
  );
}
