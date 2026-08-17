"use client";

import { useState, type FormEvent } from "react";
import {
  createVente,
  updateVente,
  type VenteFormInput,
} from "@/lib/ventes/queries";
import type { Vente } from "@/types/database";

type VenteFormProps = {
  vente?: Vente;
  onSuccess: () => void;
  onCancel: () => void;
};

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "virement", label: "Virement" },
  { value: "autre", label: "Autre" },
] as const;

export default function VenteForm({ vente, onSuccess, onCancel }: VenteFormProps) {
  const [description, setDescription] = useState(vente?.description ?? "");
  const [quantite, setQuantite] = useState(vente?.quantite ?? 1);
  const [prixUnitaire, setPrixUnitaire] = useState(vente?.prix_unitaire ?? 0);
  const [modePaiement, setModePaiement] = useState<VenteFormInput["mode_paiement"]>(
    vente?.mode_paiement ?? "especes",
  );
  const [dateVente, setDateVente] = useState(
    vente?.date_vente ?? new Date().toISOString().slice(0, 10),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const input: VenteFormInput = {
      description,
      quantite,
      prix_unitaire: prixUnitaire,
      montant_total: quantite * prixUnitaire,
      mode_paiement: modePaiement,
      date_vente: dateVente,
    };

    const result = vente
      ? await updateVente(vente.id, input)
      : await createVente(input);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Description
        <input
          type="text"
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Quantité
          <input
            type="number"
            min={0}
            step="any"
            required
            value={quantite}
            onChange={(event) => setQuantite(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Prix unitaire (FCFA)
          <input
            type="number"
            min={0}
            step="any"
            required
            value={prixUnitaire}
            onChange={(event) => setPrixUnitaire(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Mode de paiement
        <select
          value={modePaiement}
          onChange={(event) =>
            setModePaiement(event.target.value as VenteFormInput["mode_paiement"])
          }
          className="rounded border px-3 py-2"
        >
          {MODES_PAIEMENT.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          type="date"
          required
          value={dateVente}
          onChange={(event) => setDateVente(event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <p className="text-sm text-zinc-600">
        Montant total : {(quantite * prixUnitaire).toLocaleString("fr-FR")} FCFA
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : vente ? "Modifier" : "Ajouter"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
