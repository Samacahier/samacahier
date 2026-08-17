"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import RegisterProgress from "@/components/auth/RegisterProgress";
import RegisterAccountStep from "@/components/auth/RegisterAccountStep";
import RegisterCommerceStep from "@/components/auth/RegisterCommerceStep";
import {
  INITIAL_REGISTER_STATE,
  type RegisterFormState,
} from "@/components/auth/registerFormState";

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

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Créer mon espace</h1>

      <RegisterProgress step={step} />

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

      {info && <p className="text-sm text-status-paye">{info}</p>}

      <p className="text-sm">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-accent underline">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
