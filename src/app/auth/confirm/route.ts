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
  const typeBrut = searchParams.get("type");
  const type = TYPES_OTP.includes(typeBrut as EmailOtpType) ? (typeBrut as EmailOtpType) : null;
  const cible = cibleInterneOuDefaut(searchParams.get("next"), request.url);

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(cible);
    }

    console.error("[auth/confirm] verifyOtp a échoué :", error.message);
  }

  return NextResponse.redirect(new URL("/forgot-password?lien=invalide", request.url));
}

const TYPES_OTP: EmailOtpType[] = ["recovery", "signup", "invite", "magiclink", "email_change", "email"];

// Cible de redirection après vérification : uniquement une page de CE site.
//
// Sécurité (audit 2026-11-08) : l'ancienne vérification par préfixe
// (commence par "/" mais pas par "//") laissait passer "/\evil.example" ou
// "/<tabulation>/evil.example", que le navigateur lit comme "//evil.example"
// → redirection vers un site externe. Désormais on rejette antislash et
// caractères de contrôle, on résout l'URL UNE seule fois, on vérifie
// l'origine ET que le chemin résolu ne commence pas par "//" (cas
// "/.//evil.example"), et on redirige vers cet objet URL déjà résolu — sans
// le re-résoudre, ce qui rouvrirait la faille.
function cibleInterneOuDefaut(next: string | null, base: string): URL {
  const defaut = new URL("/dashboard", base);
  if (!next || !next.startsWith("/") || next.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(next)) {
    return defaut;
  }
  const cible = new URL(next, base);
  if (cible.origin !== defaut.origin || cible.pathname.startsWith("//")) return defaut;
  return cible;
}
