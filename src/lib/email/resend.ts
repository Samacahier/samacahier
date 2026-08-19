type EnvoyerEmailInput = {
  to: string[];
  subject: string;
  html: string;
};

// Envoi d'email via l'API Resend (appel direct, sans SDK) — utilisé par
// toutes les notifications de la plateforme.
export async function envoyerEmail({ to, subject, html }: EnvoyerEmailInput) {
  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Sama Cahier <contact@samacahier.sn>",
      to,
      subject,
      html,
    }),
  });

  if (!reponse.ok) {
    const detail = await reponse.json().catch(() => null);
    return { error: detail?.message ?? "Échec de l'envoi de l'email." };
  }

  return { error: null };
}
