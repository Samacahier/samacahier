type BoutonEmail = { label: string; href: string };

type EmailTemplateOptions = {
  eyebrow: string;
  titre: string;
  intro: string;
  recap?: string;
  bouton?: BoutonEmail;
  pied: string;
};

// Coquille visuelle commune à tous les emails envoyés par l'app (cf.
// email-template-model.html à la racine) : en-tête brun avec wordmark,
// bloc de récap encadré (optionnel), bouton d'action (optionnel), pied de
// page. `recap` et le contenu texte sont insérés tels quels (HTML) —
// à l'appelant d'échapper les données utilisateur avant interpolation.
export function rendreEmailHtml({ eyebrow, titre, intro, recap, bouton, pied }: EmailTemplateOptions): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#E6D6BD; font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E6D6BD; padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#FFF9EF; border-radius:14px; overflow:hidden;">

        <tr>
          <td style="background:#5A3723; padding:26px 32px;">
            <span style="font-family:Georgia,serif; font-weight:bold; font-size:19px; color:#FFF9EF;">Sama<span style="color:#D97B1E;">·</span>Cahier</span>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#D97B1E; font-weight:bold; margin:0 0 10px;">${eyebrow}</p>
            <h1 style="font-size:19px; color:#2D2616; margin:0 0 16px;">${titre}</h1>
            <p style="font-size:14px; color:#524940; line-height:1.6; margin:0 0 24px;">${intro}</p>
            ${
              recap
                ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7E7CE; border-radius:10px; margin-bottom:26px;">
              <tr>
                <td style="padding:16px 20px; font-size:13px; color:#2D2616;">${recap}</td>
              </tr>
            </table>`
                : ""
            }
            ${
              bouton
                ? `<table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#D97B1E; border-radius:10px;">
                  <a href="${bouton.href}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:bold; color:#FFF9EF; text-decoration:none;">${bouton.label}</a>
                </td>
              </tr>
            </table>`
                : ""
            }
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px; border-top:1px solid #E0D5C0; text-align:center;">
            <p style="font-size:11px; color:#999; margin:0;">${pied}</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
