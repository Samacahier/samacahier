"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { rendreEmailHtml } from "@/lib/email/template";
import { envoyerEmail } from "@/lib/email/resend";
import { obtenirOrigineSite } from "@/lib/site-url";

// Notifie chaque admin ayant activé "Nouveau commerçant inscrit" (Mon
// compte > Notifications), au moment où l'inscription aboutit (appelé
// depuis /register juste après un signUp réussi). Utilise le client
// service_role : le nouveau commerçant n'a pas le droit de lire les
// profils admin via RLS.
export async function notifierAdminNouveauCommercant(
  commercantId: string,
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

  const origine = await obtenirOrigineSite();
  const dateInscription = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = rendreEmailHtml({
    eyebrow: "Nouveau commerçant",
    titre: `${nomCommerce} vient de s'inscrire`,
    intro: "Un nouveau commerçant a créé son compte sur Sama Cahier. Voici un récapitulatif rapide.",
    recap: `<strong>Commerce :</strong> ${nomCommerce}<br><strong>Activité :</strong> ${activite ?? "Non renseignée"}<br><strong>Inscrit le :</strong> ${dateInscription}`,
    bouton: { label: "Voir sa fiche →", href: `${origine}/admin/commercants/${commercantId}` },
    pied: 'Vous recevez cet e-mail car les notifications "Nouveau commerçant" sont activées dans votre compte Sama Cahier.',
  });

  await Promise.all(
    admins.map(async ({ id }) => {
      const { data } = await admin.auth.admin.getUserById(id);
      const email = data.user?.email;
      if (!email) return;

      await envoyerEmail({
        to: [email],
        subject: "Nouveau commerçant inscrit sur Sama Cahier",
        html,
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
