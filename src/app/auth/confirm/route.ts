import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Point d'entrée des liens envoyés par e-mail (réinitialisation du mot de
// passe). Le lien contient un token_hash que l'on vérifie ici, côté serveur :
// la session est alors posée dans les cookies, puis l'utilisateur est
// redirigé vers `next` (ex. /reset-password).
//
// Remplace l'ancien lien "action_link" de Supabase, qui renvoyait les jetons
// dans le fragment d'URL (#access_token=...) : le client navigateur de
// @supabase/ssr fonctionne en flux PKCE et rejette ce format ("Not a valid
// PKCE flow url"), si bien que la page /reset-password n'avait jamais de
// session et affichait toujours "lien invalide ou expiré".
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = cheminInterneOuDefaut(searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error("[auth/confirm] verifyOtp a échoué :", error.message);
  }

  return NextResponse.redirect(new URL("/forgot-password?lien=invalide", request.url));
}

// N'accepte qu'un chemin relatif au site ("/..."), jamais une URL externe ni
// "//domaine" — évite une redirection ouverte via le paramètre `next`.
function cheminInterneOuDefaut(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}
