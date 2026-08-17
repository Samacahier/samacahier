"use client";

import type { FormEvent } from "react";
import type { RegisterFormState } from "./registerFormState";

type RegisterAccountStepProps = {
  values: RegisterFormState;
  onChange: (field: keyof RegisterFormState, value: string) => void;
  error: string | null;
  onNext: () => void;
};

const CHAMP = "rounded-xl border border-line bg-card px-3 py-2 text-ink";

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
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Nom et prénom du responsable
        <input
          type="text"
          required
          value={values.nom}
          onChange={(event) => onChange("nom", event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Téléphone
        <input
          type="tel"
          required
          value={values.telephone}
          onChange={(event) => onChange("telephone", event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Adresse e-mail
        <input
          type="email"
          required
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Mot de passe
        <input
          type="password"
          required
          minLength={6}
          value={values.password}
          onChange={(event) => onChange("password", event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Confirmer le mot de passe
        <input
          type="password"
          required
          minLength={6}
          value={values.confirmation}
          onChange={(event) => onChange("confirmation", event.target.value)}
          className={CHAMP}
        />
      </label>

      {error && <p className="text-sm text-status-impaye">{error}</p>}

      <button
        type="submit"
        className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
      >
        Suivant
      </button>
    </form>
  );
}
