"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CommercantOverview,
  CommercantsFiltre,
  CommercantsTri,
} from "@/lib/dashboard/admin-queries";
import CommercantAvatar from "@/components/admin/CommercantAvatar";

type CommercantsTableProps = {
  overviews: CommercantOverview[];
  recherche: string;
  filtre: CommercantsFiltre;
  tri: CommercantsTri;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

// Recherche/filtre/tri sont pilotés par l'URL (?q=&filtre=&tri=) : le tri et
// le filtrage sont appliqués côté base de données (voir
// listCommercantsOverviewPage), donc `overviews` n'est déjà que la page
// courante du résultat filtré — pas de re-filtrage en mémoire ici.
export default function CommercantsTable({
  overviews,
  recherche,
  filtre,
  tri,
}: CommercantsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rechercheLocale, setRechercheLocale] = useState(recherche);

  // Resynchronise l'entrée locale si la recherche change depuis l'URL (ex.
  // navigation arrière) — ajusté pendant le rendu plutôt que dans un effet,
  // conformément au pattern React pour dériver un state d'une prop.
  const [rechercheUrlAffichee, setRechercheUrlAffichee] = useState(recherche);
  if (rechercheUrlAffichee !== recherche) {
    setRechercheUrlAffichee(recherche);
    setRechercheLocale(recherche);
  }

  function naviguer(changements: { q?: string; filtre?: CommercantsFiltre; tri?: CommercantsTri }) {
    const params = new URLSearchParams(searchParams.toString());
    const q = changements.q ?? recherche;
    const f = changements.filtre ?? filtre;
    const t = changements.tri ?? tri;

    if (q) params.set("q", q);
    else params.delete("q");
    if (f !== "tous") params.set("filtre", f);
    else params.delete("filtre");
    if (t !== "recent") params.set("tri", t);
    else params.delete("tri");
    params.delete("page");

    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  // Débounce la recherche texte pour éviter une requête serveur par frappe.
  useEffect(() => {
    if (rechercheLocale === recherche) return;
    const handle = setTimeout(() => naviguer({ q: rechercheLocale }), 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rechercheLocale]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou activité..."
          value={rechercheLocale}
          onChange={(event) => setRechercheLocale(event.target.value)}
          className={`min-w-[220px] flex-1 ${CHAMP}`}
        />
        <select
          value={filtre}
          onChange={(event) => naviguer({ filtre: event.target.value as CommercantsFiltre })}
          className={CHAMP}
        >
          <option value="tous">Tous les statuts</option>
          <option value="actifs">Actifs</option>
          <option value="desactives">Désactivés</option>
        </select>
        <select
          value={tri}
          onChange={(event) => naviguer({ tri: event.target.value as CommercantsTri })}
          className={CHAMP}
        >
          <option value="recent">Plus récents</option>
          <option value="ca">Chiffre d&apos;affaires</option>
          <option value="activite">Activité récente</option>
        </select>
      </div>

      {overviews.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun commerçant ne correspond.</p>
      ) : (
        <>
          {/* Mobile/tablette (<1024px) : cartes empilées */}
          <div className="flex flex-col gap-3 lg:hidden">
            {overviews.map(({ commercant, chiffreAffaires, soldeCaisse }) => (
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
                {overviews.map(({ commercant, chiffreAffaires, soldeCaisse }) => (
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
