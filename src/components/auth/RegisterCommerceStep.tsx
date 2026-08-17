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
      <label className="flex flex-col gap-1 text-sm">
        Logo du commerce (facultatif)
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onLogoChange(event.target.files?.[0] ?? null)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Nom du commerce
        <input
          type="text"
          required
          value={values.nomCommerce}
          onChange={(event) => onChange("nomCommerce", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Activité
        <input
          type="text"
          required
          value={values.activite}
          onChange={(event) => onChange("activite", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          NINEA (facultatif)
          <input
            type="text"
            value={values.ninea}
            onChange={(event) => onChange("ninea", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          RCCM (facultatif)
          <input
            type="text"
            value={values.rccm}
            onChange={(event) => onChange("rccm", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Téléphone du commerce
          <input
            type="tel"
            value={values.telephonePro}
            onChange={(event) => onChange("telephonePro", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          E-mail professionnel
          <input
            type="email"
            value={values.emailPro}
            onChange={(event) => onChange("emailPro", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Adresse
        <input
          type="text"
          required
          value={values.adresse}
          onChange={(event) => onChange("adresse", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Ville / Région
          <input
            type="text"
            value={values.villeRegion}
            onChange={(event) => onChange("villeRegion", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1 text-sm">
          Devise
          <input
            type="text"
            required
            value={values.devise}
            onChange={(event) => onChange("devise", event.target.value)}
            className="rounded border px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon espace"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded border px-3 py-2 disabled:opacity-50"
        >
          Retour
        </button>
      </div>
    </form>
  );
}
