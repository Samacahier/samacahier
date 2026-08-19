"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCommercant, updateCommercant } from "@/lib/commercants/queries";
import { rendreEmailHtml } from "@/lib/email/template";
import { envoyerEmail } from "@/lib/email/resend";

async function verifierAdmin(): Promise<{ error: string | null; adminId: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié.", adminId: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Action réservée à l'administrateur.", adminId: null };
  }

  return { error: null, adminId: user.id };
}

// Enregistre une ligne dans le journal d'activité admin (Phase 8,
// Section 4). Appelé après chaque action sensible réussie sur une fiche
// commerçant.
async function enregistrerLog(
  adminId: string,
  action: string,
  commercantId: string | null,
  detail: string,
) {
  const supabase = await createClient();
  await supabase
    .from("admin_logs")
    .insert({ admin_id: adminId, action, commercant_id: commercantId, detail });
}

// Active ou désactive un compte commerçant, journalisé dans admin_logs.
export async function toggleCommercantActif(commercantId: string, actif: boolean) {
  const { error: erreurAuth, adminId } = await verifierAdmin();
  if (erreurAuth || !adminId) return { error: erreurAuth };

  const { error } = await updateCommercant(commercantId, { actif });
  if (error) return { error };

  const commercant = await getCommercant(commercantId);
  await enregistrerLog(
    adminId,
    actif ? "activation" : "desactivation",
    commercantId,
    `${actif ? "Compte réactivé" : "Compte désactivé"} — ${commercant?.nom_commerce ?? commercantId}`,
  );

  return { error: null };
}

// Envoie un email au commerçant (adresse de connexion réelle, récupérée
// via l'API admin) depuis sa fiche, via Resend.
export async function sendCommercantEmail(commercantId: string, objet: string, message: string) {
  const { error: erreurAuth } = await verifierAdmin();
  if (erreurAuth) return { error: erreurAuth };

  const admin = createAdminClient();
  const { data, error: userError } = await admin.auth.admin.getUserById(commercantId);
  if (userError || !data.user?.email) return { error: "Email du commerçant introuvable." };

  const html = rendreEmailHtml({
    eyebrow: "Message de l'administration",
    titre: objet,
    intro: message.replace(/\n/g, "<br>"),
    pied: "Vous recevez cet e-mail de la part de l'administration de Sama Cahier.",
  });

  return envoyerEmail({ to: [data.user.email], subject: objet, html });
}
