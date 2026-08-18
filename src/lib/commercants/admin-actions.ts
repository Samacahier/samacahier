"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifierAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Non authentifié.";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return "Action réservée à l'administrateur.";

  return null;
}

// Réinitialise le mot de passe d'un commerçant depuis sa fiche admin.
// Utilise l'API admin Supabase (clé service_role, jamais exposée au
// client) — appelable uniquement par un admin authentifié.
export async function resetCommercantPassword(commercantId: string, nouveauMotDePasse: string) {
  const erreurAuth = await verifierAdmin();
  if (erreurAuth) return { error: erreurAuth };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(commercantId, {
    password: nouveauMotDePasse,
  });

  return { error: error?.message ?? null };
}

// Envoie un email au commerçant (adresse de connexion réelle, récupérée
// via l'API admin) depuis sa fiche, via Resend.
export async function sendCommercantEmail(commercantId: string, objet: string, message: string) {
  const erreurAuth = await verifierAdmin();
  if (erreurAuth) return { error: erreurAuth };

  const admin = createAdminClient();
  const { data, error: userError } = await admin.auth.admin.getUserById(commercantId);
  if (userError || !data.user?.email) return { error: "Email du commerçant introuvable." };

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Sama Cahier <contact@samacahier.sn>",
      to: [data.user.email],
      subject: objet,
      text: message,
    }),
  });

  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    return { error: detail?.message ?? "Échec de l'envoi de l'email." };
  }

  return { error: null };
}
