"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CommercantOverview } from "@/lib/dashboard/admin-queries";
import CommercantAvatar from "@/components/admin/CommercantAvatar";

type CommercantsTableProps = {
  overviews: CommercantOverview[];
};

type Filtre = "tous" | "actifs" | "desactives";
type Tri = "recent" | "ca" | "activite";

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function CommercantsTable({ overviews }: CommercantsTableProps) {
  const router = useRouter();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const [tri, setTri] = useState<Tri>("recent");

  const lignes = useMemo(() => {
    const requete = recherche.trim().toLowerCase();

    const filtrees = overviews.filter(({ commercant }) => {
      if (filtre === "actifs" && !commercant.actif) return false;
      if (filtre === "desactives" && commercant.actif) return false;
      if (!requete) return true;
      return (
        commercant.nom_commerce.toLowerCase().includes(requete) ||
        (commercant.activite ?? "").toLowerCase().includes(requete)
      );
    });

    return [...filtrees].sort((a, b) => {
      if (tri === "ca") return b.chiffreAffaires - a.chiffreAffaires;
      if (tri === "activite") {
        return (b.derniereActivite ?? "").localeCompare(a.derniereActivite ?? "");
      }
      return b.commercant.created_at.localeCompare(a.commercant.created_at);
    });
  }, [overviews, recherche, filtre, tri]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou activité..."
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
          className={`min-w-[220px] flex-1 ${CHAMP}`}
        />
        <select
          value={filtre}
          onChange={(event) => setFiltre(event.target.value as Filtre)}
          className={CHAMP}
        >
          <option value="tous">Tous les statuts</option>
          <option value="actifs">Actifs</option>
          <option value="desactives">Désactivés</option>
        </select>
        <select value={tri} onChange={(event) => setTri(event.target.value as Tri)} className={CHAMP}>
          <option value="recent">Plus récents</option>
          <option value="ca">Chiffre d&apos;affaires</option>
          <option value="activite">Activité récente</option>
        </select>
      </div>

      {lignes.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun commerçant ne correspond.</p>
      ) : (
        <>
          {/* Mobile/tablette (<1024px) : cartes empilées */}
          <div className="flex flex-col gap-3 lg:hidden">
            {lignes.map(({ commercant, chiffreAffaires, soldeCaisse }) => (
              <Link
                key={commercant.id}
                href={`/admin/commercants/${commercant.id}`}
                className="rounded-2xl bg-card p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CommercantAvatar logoUrl={commercant.logo_url} nom={commercant.nom_commerce} />
                    <span className="font-medium text-ink">{commercant.nom_commerce}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      commercant.actif
                        ? "bg-status-paye-bg text-status-paye"
                        : "bg-status-impaye-bg text-status-impaye"
                    }`}
                  >
                    {commercant.actif ? "Actif" : "Désactivé"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-ink-muted">
                  <span>Inscrit le {commercant.created_at.slice(0, 10)}</span>
                  <span className="font-medium text-ink">
                    {chiffreAffaires.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="mt-1 text-sm text-ink-muted">
                  Solde de caisse : {soldeCaisse.toLocaleString("fr-FR")} FCFA
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop (≥1024px) : table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-card p-4 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 text-ink-muted">Commerce</th>
                  <th className="py-2 text-ink-muted">Statut</th>
                  <th className="py-2 text-ink-muted">Inscription</th>
                  <th className="py-2 text-ink-muted">Ventes (mois en cours)</th>
                  <th className="py-2 text-ink-muted">Solde de caisse</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map(({ commercant, chiffreAffaires, soldeCaisse }) => (
                  <tr
                    key={commercant.id}
                    onClick={() => router.push(`/admin/commercants/${commercant.id}`)}
                    className="cursor-pointer border-b border-line hover:bg-page"
                  >
                    <td className="py-2">
                      <Link
                        href={`/admin/commercants/${commercant.id}`}
                        className="flex items-center gap-2.5 font-medium text-ink hover:text-accent-dark"
                      >
                        <CommercantAvatar logoUrl={commercant.logo_url} nom={commercant.nom_commerce} />
                        {commercant.nom_commerce}
                      </Link>
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          commercant.actif
                            ? "bg-status-paye-bg text-status-paye"
                            : "bg-status-impaye-bg text-status-impaye"
                        }`}
                      >
                        {commercant.actif ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="py-2 text-ink-muted">{commercant.created_at.slice(0, 10)}</td>
                    <td className="py-2 text-ink">
                      {chiffreAffaires.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="py-2 text-ink">{soldeCaisse.toLocaleString("fr-FR")} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
