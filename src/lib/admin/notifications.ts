"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Notifie chaque admin ayant activé "Nouveau commerçant inscrit" (Mon
// compte > Notifications), au moment où l'inscription aboutit (appelé
// depuis /register juste après un signUp réussi). Utilise le client
// service_role : le nouveau commerçant n'a pas le droit de lire les
// profils admin via RLS.
export async function notifierAdminNouveauCommercant(
  nomCommerce: string,
  activite: string | null,
) {
  const admin = createAdminClient();

  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .eq("notif_nouveau_commercant", true);

  if (!admins || admins.length === 0) return;

  await Promise.all(
    admins.map(async ({ id }) => {
      const { data } = await admin.auth.admin.getUserById(id);
      const email = data.user?.email;
      if (!email) return;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sama Cahier <contact@samacahier.sn>",
          to: [email],
          subject: "Nouveau commerçant inscrit sur Sama Cahier",
          text: `${nomCommerce}${activite ? ` (${activite})` : ""} vient de créer un compte.`,
        }),
      });
    }),
  );
}

// "Commerçant inactif" (alerte après 14j sans activité) et "Résumé
// hebdomadaire" (chaque lundi) : les préférences ci-dessus (colonnes
// notif_commercant_inactif / notif_resume_hebdo sur profiles) sont
// enregistrées et lisibles dès maintenant, mais aucun envoi réel n'est
// déclenché ici. Ces deux notifications sont périodiques et nécessitent
// une tâche planifiée (ex. Supabase Cron Job + Edge Function, ou route
// API appelée par un cron externe) qui n'existe pas encore dans le
// projet — hors périmètre de cette tâche, à construire séparément plutôt
// que d'improviser un déclenchement ad hoc ici.
