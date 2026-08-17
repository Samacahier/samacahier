import type { ReactNode } from "react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

// Scope la police d'affichage (font-display) aux pages /login et /register :
// AuthShell l'utilise pour le titre et les accroches de marque, mais elle
// n'est chargée nulle part ailleurs en dehors de la page d'accueil.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className={bricolageGrotesque.variable}>{children}</div>;
}
