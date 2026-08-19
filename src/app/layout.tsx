import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Sama Cahier est l'application de gestion quotidienne pour les petits commerces au Sénégal : ventes, dépenses, stock, créances et caisse, tout ce que vous notiez à la main, maintenant fiable et toujours avec vous.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sama-cahier.com"),
  title: {
    default: "Sama Cahier",
    template: "%s | Sama Cahier",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Sama Cahier",
    description: DESCRIPTION,
    url: "/",
    siteName: "Sama Cahier",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sama Cahier",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#d97b1e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
