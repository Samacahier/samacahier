"use client";

import { useState, type FormEvent } from "react";
import { createVente, updateVente, type VenteFormInput } from "@/lib/ventes/queries";
import AjoutClientRapide from "./AjoutClientRapide";
import type { Client, Stock, Vente } from "@/types/database";

type VenteFormProps = {
  vente?: Vente;
  produits: Stock[];
  clients: Client[];
  onSuccess: () => void;
  onCancel: () => void;
};

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "virement", label: "Virement" },
  { value: "autre", label: "Autre" },
] as const;

const STATUTS: { value: NonNullable<VenteFormInput["statut"]>; label: string }[] = [
  { value: "paye", label: "Payé" },
  { value: "credit", label: "Crédit" },
  { value: "impaye", label: "Impayé" },
];

const STATUT_BADGE: Record<string, string> = {
  paye: "bg-green-100 text-green-800",
  credit: "bg-amber-100 text-amber-800",
  impaye: "bg-red-100 text-red-800",
};

export default function VenteForm({
  vente,
  produits,
  clients,
  onSuccess,
  onCancel,
}: VenteFormProps) {
  const [produitId, setProduitId] = useState(vente?.produit_id ?? "");
  const [description, setDescription] = useState(vente?.description ?? "");
  const [quantite, setQuantite] = useState(vente?.quantite ?? 1);
  const [prixUnitaire, setPrixUnitaire] = useState(vente?.prix_unitaire ?? 0);
  const [remise, setRemise] = useState(vente?.remise ?? 0);
  const [statut, setStatut] = useState<NonNullable<VenteFormInput["statut"]>>(
    vente?.statut ?? "paye",
  );
  const [montantEncaisse, setMontantEncaisse] = useState(vente?.montant_encaisse ?? 0);
  const [modePaiement, setModePaiement] = useState<
    NonNullable<VenteFormInput["mode_paiement"]>
  >(vente?.mode_paiement ?? "especes");
  const [dateVente, setDateVente] = useState(
    vente?.date_vente ?? new Date().toISOString().slice(0, 10),
  );
  const [clientId, setClientId] = useState(vente?.client_id ?? "");
  const [clientsDisponibles, setClientsDisponibles] = useState(clients);
  const [ajoutClientOuvert, setAjoutClientOuvert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const montantTotal = Math.max(0, quantite * prixUnitaire - remise);

  function handleProduitChange(id: string) {
    setProduitId(id);
    const produit = produits.find((item) => item.id === id);
    if (produit) {
      setDescription(produit.nom_article);
      if (produit.prix_vente != null) setPrixUnitaire(produit.prix_vente);
    }
  }

  function handleClientCreated(client: Client) {
    setClientsDisponibles((current) => [...current, client]);
    setClientId(client.id);
    setAjoutClientOuvert(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const montantEncaisseFinal =
      statut === "credit" ? montantEncaisse : statut === "paye" ? montantTotal : 0;

    const input: VenteFormInput = {
      produit_id: produitId || null,
      description,
      quantite,
      prix_unitaire: prixUnitaire,
      remise,
      montant_total: montantTotal,
      statut,
      montant_encaisse: montantEncaisseFinal,
      mode_paiement: modePaiement,
      date_vente: dateVente,
      client_id: clientId || null,
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
        Produit (facultatif — vente hors catalogue sinon)
        <select
          value={produitId}
          onChange={(event) => handleProduitChange(event.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">—</option>
          {produits.map((produit) => (
            <option key={produit.id} value={produit.id}>
              {produit.nom_article}
            </option>
          ))}
        </select>
      </label>

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

      <div className="flex flex-col gap-1 text-sm">
        <span>Client</span>
        <div className="flex gap-2">
          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="flex-1 rounded border px-3 py-2"
          >
            <option value="">Client comptant</option>
            {clientsDisponibles.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nom}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAjoutClientOuvert((value) => !value)}
            className="rounded border px-3 py-2"
            aria-label="Ajouter un client"
          >
            +
          </button>
        </div>
        {ajoutClientOuvert && (
          <AjoutClientRapide
            onCreated={handleClientCreated}
            onCancel={() => setAjoutClientOuvert(false)}
          />
        )}
      </div>

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
          Prix unitaire
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

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Remise
          <input
            type="number"
            min={0}
            step="any"
            value={remise}
            onChange={(event) => setRemise(Number(event.target.value))}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span>Statut de la vente</span>
        <div className="flex gap-2">
          {STATUTS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatut(option.value)}
              className={`flex-1 rounded border px-3 py-2 ${
                statut === option.value ? "border-black bg-black text-white" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Montant encaissé
          <input
            type="number"
            min={0}
            step="any"
            disabled={statut !== "credit"}
            value={statut === "credit" ? montantEncaisse : montantTotal}
            onChange={(event) => setMontantEncaisse(Number(event.target.value))}
            className="rounded border px-3 py-2 disabled:bg-zinc-100 disabled:text-zinc-500"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Mode de paiement
          <select
            value={modePaiement}
            onChange={(event) =>
              setModePaiement(
                event.target.value as NonNullable<VenteFormInput["mode_paiement"]>,
              )
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
      </div>

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

      <div className="flex items-center justify-between border-t pt-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_BADGE[statut]}`}
        >
          {STATUTS.find((option) => option.value === statut)?.label}
        </span>
        <p className="text-lg font-semibold">
          Total : {montantTotal.toLocaleString("fr-FR")}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer la vente"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-2">
          Annuler
        </button>
      </div>
    </form>
  );
}
