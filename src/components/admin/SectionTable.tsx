type SectionTableProps = {
  titre: string;
  colonnes: string[];
  lignes: string[][];
};

// Table générique en lecture seule (actuellement : journal d'activité
// admin). Même repli cartes/table que les listes commerçant (Ventes,
// Dépenses, etc.) sous 1024px, générique puisque colonnes/lignes le sont.
export default function SectionTable({ titre, colonnes, lignes }: SectionTableProps) {
  return (
    <div>
      <h2 className="mb-3 font-semibold text-ink">{titre}</h2>
      {lignes.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucune donnée.</p>
      ) : (
        <>
          {/* Mobile/tablette (<1024px) : cartes empilées */}
          <div className="flex flex-col gap-3 lg:hidden">
            {lignes.map((ligne, index) => (
              <div key={index} className="rounded-2xl bg-card p-4">
                {ligne.map((valeur, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 border-b border-line py-1.5 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span className="shrink-0 text-xs font-medium text-ink-muted">
                      {colonnes[i]}
                    </span>
                    <span className="text-right text-sm text-ink">{valeur}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Desktop (≥1024px) : table */}
          <div className="hidden overflow-x-auto rounded-2xl bg-card p-4 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  {colonnes.map((colonne) => (
                    <th key={colonne} className="py-2 text-ink-muted">
                      {colonne}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index} className="border-b border-line">
                    {ligne.map((valeur, i) => (
                      <td key={i} className="py-2 text-ink">
                        {valeur}
                      </td>
                    ))}
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
