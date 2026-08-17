import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import PochesCallout from "@/components/landing/PochesCallout";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Sama Cahier — Le cahier de votre commerce, maintenant fiable",
};

export default function LandingPage() {
  return (
    <div
      className={`${bricolageGrotesque.variable} ${inter.variable} ${jetBrainsMono.variable} ${caveat.variable} font-body min-h-screen bg-page text-ink`}
    >
      <Header />
      <Hero />
      <ProblemSection />
      <FeaturesGrid />
      <PochesCallout />
      <FinalCta />
      <Footer />
    </div>
  );
}
