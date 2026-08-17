import type { Caisse } from "@/types/database";

type MouvementsDirectsListProps = {
  mouvements: Caisse[];
};

export default function MouvementsDirectsList({ mouvements }: MouvementsDirectsListProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
      <h2 className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        Mouvements directs
      </h2>

      {mouvements.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun mouvement direct enregistré.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 text-ink-muted">Date</th>
              <th className="py-2 text-ink-muted">Description</th>
              <th className="py-2 text-ink-muted">Montant</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((mouvement) => (
              <tr key={mouvement.id} className="border-b border-line">
                <td className="py-2">{mouvement.date_mouvement.slice(0, 10)}</td>
                <td className="py-2">{mouvement.motif ?? "—"}</td>
                <td
                  className={`py-2 font-medium ${
                    mouvement.type_mouvement === "entree"
                      ? "text-status-paye"
                      : "text-status-impaye"
                  }`}
                >
                  {mouvement.type_mouvement === "entree" ? "+" : "-"}
                  {mouvement.montant.toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
