"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { rendreEmailHtml } from "@/lib/email/template";
import { envoyerEmail } from "@/lib/email/resend";
import { obtenirOrigineSite } from "@/lib/site-url";

// Génère le lien de réinitialisation via l'API admin (service_role) —
// PAS resetPasswordForEmail, qui ferait envoyer l'email par Supabase lui-
// même plutôt que par Resend avec notre gabarit. Le message de retour
// reste générique dans tous les cas (compte trouvé ou non), pour ne pas
// révéler si une adresse est inscrite.
export async function demanderReinitialisationMotDePasse(email: string) {
  const admin = createAdminClient();
  const origine = await obtenirOrigineSite();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origine}/reset-password` },
  });

  if (!error && data.properties?.action_link) {
    const html = rendreEmailHtml({
      eyebrow: "Mot de passe oublié",
      titre: "Réinitialisez votre mot de passe",
      intro:
        "Vous avez demandé à réinitialiser le mot de passe de votre compte Sama Cahier. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.",
      bouton: { label: "Créer un nouveau mot de passe →", href: data.properties.action_link },
      pied: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.",
    });

    await envoyerEmail({
      to: [email],
      subject: "Réinitialisation de votre mot de passe Sama Cahier",
      html,
    });
  }

  return { error: null };
}
