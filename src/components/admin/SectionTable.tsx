type SectionTableProps = {
  titre: string;
  colonnes: string[];
  lignes: string[][];
};

// Table générique en lecture seule pour les sections de données brutes
// d'un commerçant (ventes, stock, créances, caisse) sur sa fiche admin.
export default function SectionTable({ titre, colonnes, lignes }: SectionTableProps) {
  return (
    <div>
      <h2 className="mb-3 font-semibold text-ink">{titre}</h2>
      {lignes.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucune donnée.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
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
      )}
    </div>
  );
}
