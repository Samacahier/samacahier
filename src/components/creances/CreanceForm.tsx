"use client";

import { useState, type FormEvent } from "react";
import {
  createCreance,
  updateCreance,
  type CreanceFormInput,
} from "@/lib/creances/queries";
import type { Creance } from "@/types/database";

type CreanceFormProps = {
  creance?: Creance;
  onSuccess: () => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

const STATUTS = [
  { value: "en_cours", label: "En cours" },
  { value: "soldee", label: "Soldée" },
  { value: "en_retard", label: "En retard" },
] as const;

export default function CreanceForm({ creance, onSuccess, onCancel }: CreanceFormProps) {
  const [clientNom, setClientNom] = useState(creance?.client_nom ?? "");
  const [clientTelephone, setClientTelephone] = useState(
    creance?.client_telephone ?? "",
  );
  const [montant, setMontant] = useState(creance?.montant ?? 0);
  const [montantRembourse, setMontantRembourse] = useState(
    creance?.montant_rembourse ?? 0,
  );
  const [statut, setStatut] = useState<CreanceFormInput["statut"]>(
    creance?.statut ?? "en_cours",
  );
  const [dateEcheance, setDateEcheance] = useState(creance?.date_echeance ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: CreanceFormInput = {
      client_nom: clientNom,
      client_telephone: clientTelephone || null,
      montant,
      montant_rembourse: montantRembourse,
      statut,
      date_echeance: dateEcheance || null,
    };

    const result = creance
      ? await updateCreance(creance.id, input)
      : await createCreance(input);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Client
          <input
            type="text"
            required
            value={clientNom}
            onChange={(event) => setClientNom(event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Téléphone
          <input
            type="tel"
            value={clientTelephone}
            onChange={(event) => setClientTelephone(event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Montant dû (FCFA)
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
          Montant remboursé (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            value={montantRembourse}
            onChange={(event) => setMontantRembourse(Number(event.target.value))}
            className={CHAMP}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Statut
          <select
            value={statut}
            onChange={(event) =>
              setStatut(event.target.value as CreanceFormInput["statut"])
            }
            className={CHAMP}
          >
            {STATUTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Échéance
          <input
            type="date"
            value={dateEcheance}
            onChange={(event) => setDateEcheance(event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : creance ? "Modifier" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-secondary px-3 py-2 font-medium text-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
