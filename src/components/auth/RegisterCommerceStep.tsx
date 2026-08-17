"use client";

import type { FormEvent } from "react";
import type { RegisterFormState } from "./registerFormState";

type RegisterCommerceStepProps = {
  values: RegisterFormState;
  onChange: (field: keyof RegisterFormState, value: string) => void;
  onLogoChange: (file: File | null) => void;
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

export default function RegisterCommerceStep({
  values,
  onChange,
  onLogoChange,
  error,
  loading,
  onBack,
  onSubmit,
}: RegisterCommerceStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Logo du commerce (facultatif)
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onLogoChange(event.target.files?.[0] ?? null)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom du commerce
        <input
          type="text"
          required
          value={values.nomCommerce}
          onChange={(event) => onChange("nomCommerce", event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Activité
        <input
          type="text"
          required
          value={values.activite}
          onChange={(event) => onChange("activite", event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          NINEA (facultatif)
          <input
            type="text"
            value={values.ninea}
            onChange={(event) => onChange("ninea", event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          RCCM (facultatif)
          <input
            type="text"
            value={values.rccm}
            onChange={(event) => onChange("rccm", event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Téléphone du commerce
          <input
            type="tel"
            value={values.telephonePro}
            onChange={(event) => onChange("telephonePro", event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          E-mail professionnel
          <input
            type="email"
            value={values.emailPro}
            onChange={(event) => onChange("emailPro", event.target.value)}
            className={CHAMP}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Adresse
        <input
          type="text"
          required
          value={values.adresse}
          onChange={(event) => onChange("adresse", event.target.value)}
          className={CHAMP}
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Ville / Région
          <input
            type="text"
            value={values.villeRegion}
            onChange={(event) => onChange("villeRegion", event.target.value)}
            className={CHAMP}
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
          Devise
          <input
            type="text"
            required
            value={values.devise}
            onChange={(event) => onChange("devise", event.target.value)}
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
          {loading ? "Création..." : "Créer mon espace"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-xl bg-secondary px-3 py-2 font-medium text-ink disabled:opacity-50"
        >
          Retour
        </button>
      </div>
    </form>
  );
}
