import Link from "next/link";
import EtatPage from "@/components/ui/EtatPage";

export default function NotFound() {
  return (
    <EtatPage
      code="404"
      titre="Page introuvable"
      message="Cette page n'existe pas ou a été déplacée."
    >
      <Link href="/dashboard" className="rounded-xl bg-accent px-4 py-2 font-medium text-white">
        Aller au tableau de bord
      </Link>
      <Link href="/" className="rounded-xl bg-secondary px-4 py-2 font-medium text-ink">
        Accueil
      </Link>
    </EtatPage>
  );
}
