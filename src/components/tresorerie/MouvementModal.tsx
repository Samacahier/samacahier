"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { createMouvement } from "@/lib/caisse/queries";
import type { Caisse } from "@/types/database";

type MouvementModalProps = {
  typePoche: Caisse["type_poche"];
  typeMouvement: Caisse["type_mouvement"];
  labelPoche: string;
  onClose: () => void;
  onSuccess: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function MouvementModal({
  typePoche,
  typeMouvement,
  labelPoche,
  onClose,
  onSuccess,
}: MouvementModalProps) {
  const [montant, setMontant] = useState(0);
  const [motif, setMotif] = useState("");
  const [dateMouvement, setDateMouvement] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const titre =
    typeMouvement === "entree"
      ? `Faire entrer de l'argent — ${labelPoche}`
      : `Sortir de l'argent — ${labelPoche}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await createMouvement({
      type_mouvement: typeMouvement,
      type_poche: typePoche,
      montant,
      motif: motif || null,
      date_mouvement: dateMouvement,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <Modal title={titre} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Montant
          <input
            type="number"
            min={0}
            step="any"
            required
            value={montant}
            onChange={(event) => setMontant(Number(event.target.value))}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Description
          <input
            type="text"
            value={motif}
            onChange={(event) => setMotif(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Date
          <input
            type="date"
            required
            value={dateMouvement}
            onChange={(event) => setDateMouvement(event.target.value)}
            className={CHAMP}
          />
        </label>

        {error && <p className="text-sm text-status-impaye">{error}</p>}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-3 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Confirmer"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-secondary px-3 py-3 font-medium text-ink"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
