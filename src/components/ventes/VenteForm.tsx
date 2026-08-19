"use client";

import { useState, type FormEvent } from "react";
import { createVente, updateVente, type VenteFormInput } from "@/lib/ventes/queries";
import NumberField from "@/components/ui/NumberField";
import AjoutClientRapide from "./AjoutClientRapide";
import type { Client, Stock, Vente } from "@/types/database";

type VenteFormProps = {
  vente?: Vente;
  produits: Stock[];
  clients: Client[];
  onSuccess: (venteEnregistree: Vente) => void;
  onCancel: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

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
  paye: "bg-status-paye-bg text-status-paye",
  credit: "bg-status-credit-bg text-status-credit",
  impaye: "bg-status-impaye-bg text-status-impaye",
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

    if (result.error || !result.vente) {
      setError(result.error ?? "Erreur inattendue.");
      return;
    }

    onSuccess(result.vente);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Produit (facultatif — vente hors catalogue sinon)
        <select
          value={produitId}
          onChange={(event) => handleProduitChange(event.target.value)}
          className={CHAMP}
        >
          <option value="">—</option>
          {produits.map((produit) => (
            <option key={produit.id} value={produit.id}>
              {produit.nom_article}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Description
        <input
          type="text"
          required
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex flex-col gap-1 text-sm text-ink-muted">
        <span>Client</span>
        <div className="flex gap-2">
          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className={`min-w-0 flex-1 ${CHAMP}`}
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
            className="rounded-xl bg-secondary px-3 py-2 font-medium text-ink"
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Quantité
          <NumberField min={0} required value={quantite} onChange={setQuantite} className={CHAMP} />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Prix unitaire
          <NumberField min={0} required value={prixUnitaire} onChange={setPrixUnitaire} className={CHAMP} />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm text-ink-muted sm:col-span-1">
          Remise
          <NumberField min={0} value={remise} onChange={setRemise} className={CHAMP} />
        </label>
      </div>

      <div className="flex flex-col gap-1 text-sm text-ink-muted">
        <span>Statut de la vente</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {STATUTS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatut(option.value)}
              className={`rounded-xl border px-3 py-2 ${
                statut === option.value
                  ? "border-accent bg-accent text-white"
                  : "border-line text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Montant encaissé
          <NumberField
            min={0}
            disabled={statut !== "credit"}
            value={statut === "credit" ? montantEncaisse : montantTotal}
            onChange={setMontantEncaisse}
            className={`${CHAMP} disabled:bg-page disabled:text-ink-muted`}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Mode de paiement
          <select
            value={modePaiement}
            onChange={(event) =>
              setModePaiement(
                event.target.value as NonNullable<VenteFormInput["mode_paiement"]>,
              )
            }
            className={CHAMP}
          >
            {MODES_PAIEMENT.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Date
        <input
          type="date"
          required
          value={dateVente}
          onChange={(event) => setDateVente(event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex items-center justify-between border-t border-line pt-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_BADGE[statut]}`}
        >
          {STATUTS.find((option) => option.value === statut)?.label}
        </span>
        <p className="text-lg font-semibold text-ink">
          Total : {montantTotal.toLocaleString("fr-FR")}
        </p>
      </div>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex flex-col gap-2 bg-card px-6 pt-3 pb-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent px-3 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer la vente"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl bg-secondary px-3 py-3 font-medium text-ink"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
