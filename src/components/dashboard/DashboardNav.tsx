import Link from "next/link";

const LIENS = [
  { href: "/ventes", label: "Ventes" },
  { href: "/depenses", label: "Dépenses" },
  { href: "/stocks", label: "Produits" },
  { href: "/creances", label: "Créances" },
  { href: "/caisse", label: "Caisse" },
  { href: "/clients", label: "Clients" },
  { href: "/fournisseurs", label: "Fournisseurs" },
  { href: "/rapports", label: "Rapports" },
] as const;

export default function DashboardNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-4 text-sm">
      {LIENS.map((lien) => (
        <Link key={lien.href} href={lien.href} className="underline">
          {lien.label}
        </Link>
      ))}
    </nav>
  );
}
