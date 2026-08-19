"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { notifierAdminNouveauCommercant } from "@/lib/admin/notifications";
import AuthShell from "@/components/auth/AuthShell";
import RegisterProgress from "@/components/auth/RegisterProgress";
import RegisterAccountStep from "@/components/auth/RegisterAccountStep";
import RegisterCommerceStep from "@/components/auth/RegisterCommerceStep";
import {
  INITIAL_REGISTER_STATE,
  type RegisterFormState,
} from "@/components/auth/registerFormState";

const COPIE_ETAPE = {
  1: {
    eyebrow: "Étape 1 sur 2",
    titre: "Créer votre compte",
    sousTitre: "Votre compte permet de retrouver votre commerce et vos données.",
    brandTitre: "Deux minutes pour commencer.",
    brandBullets: [
      { mark: "1", texte: "Créez votre compte" },
      { mark: "2", texte: "Configurez votre commerce" },
      { mark: "✓", texte: "C'est prêt — gratuit pour démarrer" },
    ],
  },
  2: {
    eyebrow: "Étape 2 sur 2",
    titre: "Configurez votre commerce",
    sousTitre: "Ces informations seront utilisées sur vos reçus et rapports.",
    brandTitre: "Dernière étape.",
    brandBullets: [
      { mark: "✓", texte: "Compte créé" },
      { mark: "2", texte: "Ces infos apparaîtront sur vos reçus et rapports" },
    ],
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<RegisterFormState>(INITIAL_REGISTER_STATE);
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof RegisterFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleNext() {
    if (values.password !== values.confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError(null);
    setStep(2);
  }

  async function uploadLogo(supabase: ReturnType<typeof createClient>, userId: string) {
    if (!logo) return;

    const chemin = `${userId}/${Date.now()}-${logo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(chemin, logo);

    if (uploadError) return;

    const { data } = supabase.storage.from("logos").getPublicUrl(chemin);
    await supabase.from("commercants").update({ logo_url: data.publicUrl }).eq(
      "id",
      userId,
    );
  }

  async function handleSubmit() {
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // Lu par le trigger handle_new_user() pour créer profiles + commercants
        // avec tous les champs de l'étape 2 (cf. supabase/migrations).
        data: {
          role: "commercant",
          nom: values.nom,
          telephone: values.telephone,
          nom_commerce: values.nomCommerce,
          activite: values.activite,
          ninea: values.ninea,
          rccm: values.rccm,
          telephone_pro: values.telephonePro,
          email_pro: values.emailPro,
          adresse: values.adresse,
          ville_region: values.villeRegion,
          devise: values.devise,
        },
      },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Inscription impossible.");
      setLoading(false);
      return;
    }

    // Le trigger handle_new_user() a déjà créé profiles + commercants à ce
    // stade (côté Supabase, avant le retour de signUp) — safe de notifier.
    await notifierAdminNouveauCommercant(data.user.id, values.nomCommerce, values.activite || null);

    // L'upload du logo nécessite une session active (RLS du bucket "logos") :
    // seulement possible si l'inscription est immédiatement confirmée.
    if (data.session) {
      await uploadLogo(supabase, data.user.id);
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setInfo("Compte créé. Vérifiez votre email pour confirmer votre inscription.");
    setLoading(false);
  }

  const copie = COPIE_ETAPE[step];

  return (
    <AuthShell
      eyebrow={copie.eyebrow}
      titre={copie.titre}
      sousTitre={copie.sousTitre}
      brandTitre={copie.brandTitre}
      brandBullets={[...copie.brandBullets]}
      progress={<RegisterProgress step={step} />}
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-accent-dark underline">
            Se connecter
          </Link>
        </>
      }
    >
      {step === 1 ? (
        <RegisterAccountStep
          values={values}
          onChange={handleChange}
          error={error}
          onNext={handleNext}
        />
      ) : (
        <RegisterCommerceStep
          values={values}
          onChange={handleChange}
          onLogoChange={setLogo}
          error={error}
          loading={loading}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}

      {info && <p className="mt-4 text-sm text-status-paye">{info}</p>}
    </AuthShell>
  );
}
