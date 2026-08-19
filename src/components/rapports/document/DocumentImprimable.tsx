import type { ReactNode } from "react";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

type DocumentImprimableProps = {
  id: string;
  children: ReactNode;
};

// Gabarit commun à tous les documents imprimables (hors reçu de vente, qui
// garde son propre gabarit RecuContent) — cf. bilan-document-model.html à
// la racine du projet. Fond blanc fixe, largeur A4, polices scopées ici
// (même technique que AuthLayout pour font-display/font-jetbrains).
export default function DocumentImprimable({ id, children }: DocumentImprimableProps) {
  return (
    <div className={`${bricolageGrotesque.variable} ${jetbrainsMono.variable}`}>
      <div
        id={id}
        className="mx-auto w-full max-w-[794px] bg-white px-6 py-10 text-[#1a1a1a] shadow-md sm:px-[60px] sm:py-14 print:max-w-none print:p-0 print:shadow-none"
      >
        {children}
      </div>
    </div>
  );
}
