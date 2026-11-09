"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { echapperHtml, rendreEmailHtml } from "@/lib/email/template";
import { envoyerEmail } from "@/lib/email/resend";
import { obtenirOrigineSite } from "@/lib/site-url";

const FORMAT_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Notifie chaque admin ayant activé "Nouveau commerçant inscrit" (Mon
// compte > Notifications), juste après l'inscription (appelé depuis
// /register après un signUp réussi). Utilise le client service_role : le
// nouveau commerçant n'a pas le droit de lire les profils admin via RLS.
//
// Sécurité (audit 2026-11-08) : cette action est appelable par n'importe
// qui (pas encore de session si la confirmation d'email est requise). Elle
// ne fait donc plus confiance à ses arguments :
// - le nom et l'activité sont relus en base pour cet identifiant ;
// - la fonction SQL reserver_notification_inscription() n'autorise qu'UN
//   envoi par compte, et seulement dans les 30 minutes qui suivent sa
//   création (verrou atomique) : impossible de rejouer l'appel en boucle ;
// - les valeurs sont échappées avant d'entrer dans le HTML de l'email.
export async function notifierAdminNouveauCommercant(commercantId: string) {
  if (typeof commercantId !== "string" || !FORMAT_UUID.test(commercantId)) return;

  const admin = createAdminClient();

  const { data: reservation, error } = await admin.rpc("reserver_notification_inscription", {
    p_id: commercantId,
  });
  if (error) {
    console.error("[notification-inscription] réservation échouée :", error.message);
    return;
  }
  const commerce = reservation?.[0];
  if (!commerce) return; // déjà notifié, trop ancien ou inexistant

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
  const nomCommerce = commerce.nom_commerce || "Nouveau commerce";

  const html = rendreEmailHtml({
    eyebrow: "Nouveau commerçant",
    titre: `${nomCommerce} vient de s'inscrire`,
    intro: "Un nouveau commerçant a créé son compte sur Sama Cahier. Voici un récapitulatif rapide.",
    recap: `<strong>Commerce :</strong> ${echapperHtml(nomCommerce)}<br><strong>Activité :</strong> ${echapperHtml(commerce.activite ?? "Non renseignée")}<br><strong>Inscrit le :</strong> ${dateInscription}`,
    bouton: {
      label: "Voir sa fiche →",
      href: `${origine}/admin/commercants/${encodeURIComponent(commercantId)}`,
    },
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
