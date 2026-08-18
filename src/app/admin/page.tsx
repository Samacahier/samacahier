"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
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

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Ce compte n'est pas un compte administrateur.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#241811] to-hero-deep p-6">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,249,239,0.045)_1.5px,transparent_1.5px)] [background-size:26px_26px]"
      />

      <Link
        href="/"
        className="absolute top-7 left-8 text-[13px] font-semibold text-card/50"
      >
        ← Retour au site
      </Link>

      <div className="relative w-full max-w-[380px] rounded-[18px] border border-card/12 bg-black/[0.22] px-[34px] py-10 backdrop-blur-[6px]">
        <div className="font-jetbrains mb-[22px] inline-flex items-center gap-2 rounded-full border border-card/18 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-card/55">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3 w-3"
          >
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          ACCÈS RESTREINT
        </div>

        <h1 className="font-display mb-2 text-2xl text-card">Accès administrateur</h1>
        <p className="mb-7 text-[13.5px] text-card/55">
          Réservé à la gestion de la plateforme.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-4 flex flex-col gap-[7px] text-[12.5px] font-semibold text-card/65">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-[10px] border border-card/16 bg-black/[0.28] px-[13px] py-3 text-[14.5px] font-normal text-card placeholder:text-card/30 focus:border-accent focus:outline-none"
            />
          </label>

          <label className="mb-4 flex flex-col gap-[7px] text-[12.5px] font-semibold text-card/65">
            Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-[10px] border border-card/16 bg-black/[0.28] px-[13px] py-3 text-[14.5px] font-normal text-card placeholder:text-card/30 focus:border-accent focus:outline-none"
            />
          </label>

          {error && <p className="text-[13px] text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-[22px] rounded-[10px] bg-accent py-[13px] text-[14.5px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11.5px] text-card/35">
          Accès réservé à l&apos;administrateur de la plateforme.
        </p>
      </div>
    </div>
  );
}
