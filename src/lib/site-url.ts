import { headers } from "next/headers";

// Origine du site à partir de l'en-tête Host de la requête en cours —
// fonctionne aussi bien en local qu'en production sans variable d'env
// dédiée. Repli sur le domaine de production (metadataBase) si absent.
export async function obtenirOrigineSite(): Promise<string> {
  const liste = await headers();
  const host = liste.get("host");
  if (!host) return "https://sama-cahier.com";

  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${local ? "http" : "https"}://${host}`;
}
