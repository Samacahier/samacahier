"use client";

import type { FormEvent } from "react";
import type { RegisterFormState } from "./registerFormState";

type RegisterAccountStepProps = {
  values: RegisterFormState;
  onChange: (field: keyof RegisterFormState, value: string) => void;
  error: string | null;
  onNext: () => void;
};

export default function RegisterAccountStep({
  values,
  onChange,
  error,
  onNext,
}: RegisterAccountStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nom et prénom du responsable
        <input
          type="text"
          required
          value={values.nom}
          onChange={(event) => onChange("nom", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Téléphone
        <input
          type="tel"
          required
          value={values.telephone}
          onChange={(event) => onChange("telephone", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Adresse e-mail
        <input
          type="email"
          required
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Mot de passe
        <input
          type="password"
          required
          minLength={6}
          value={values.password}
          onChange={(event) => onChange("password", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Confirmer le mot de passe
        <input
          type="password"
          required
          minLength={6}
          value={values.confirmation}
          onChange={(event) => onChange("confirmation", event.target.value)}
          className="rounded border px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="rounded bg-black px-3 py-2 text-white">
        Suivant
      </button>
    </form>
  );
}
