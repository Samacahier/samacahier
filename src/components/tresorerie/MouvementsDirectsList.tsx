import type { Caisse } from "@/types/database";

type MouvementsDirectsListProps = {
  mouvements: Caisse[];
};

export default function MouvementsDirectsList({ mouvements }: MouvementsDirectsListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-zinc-600">Mouvements directs</h2>

      {mouvements.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun mouvement direct enregistré.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th className="py-2">Description</th>
              <th className="py-2">Montant</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.map((mouvement) => (
              <tr key={mouvement.id} className="border-b">
                <td className="py-2">{mouvement.date_mouvement.slice(0, 10)}</td>
                <td className="py-2">{mouvement.motif ?? "—"}</td>
                <td
                  className={`py-2 ${
                    mouvement.type_mouvement === "entree"
                      ? "text-green-700"
                      : "text-red-600"
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
