import { headers } from "next/headers";

// Origine du site utilisée dans les liens envoyés par e-mail.
// NEXT_PUBLIC_SITE_URL est prioritaire : l'en-tête Host vient du client, et
// s'y fier pour un lien de réinitialisation permettrait d'envoyer à une
// victime un lien pointant vers un domaine tiers (le jeton y fuiterait).
// Repli sur l'en-tête Host (pratique en local), puis sur le domaine de prod.
export async function obtenirOrigineSite(): Promise<string> {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configuree) return configuree;

  const liste = await headers();
  const host = liste.get("host");
  if (!host) return "https://sama-cahier.com";

  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${local ? "http" : "https"}://${host}`;
}
