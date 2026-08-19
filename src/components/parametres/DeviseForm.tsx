"use client";

import { useState, type FormEvent } from "react";
import { updateCommercant } from "@/lib/commercants/queries";

type DeviseFormProps = {
  commercantId: string;
  deviseActuelle: string;
};

const DEVISES = ["FCFA", "EUR", "USD"];

export default function DeviseForm({ commercantId, deviseActuelle }: DeviseFormProps) {
  const [devise, setDevise] = useState(deviseActuelle);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setInfo(null);

    const { error } = await updateCommercant(commercantId, { devise });

    setLoading(false);
    setInfo(error ?? "Devise mise à jour.");
  }

  return (
    <div className="rounded-2xl bg-card p-4">
      <h2 className="mb-3 font-semibold text-ink">Devise</h2>
      <form onSubmit={handleSubmit} className="flex max-w-xs flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Devise utilisée dans l&apos;app
          <select
            value={devise}
            onChange={(event) => setDevise(event.target.value)}
            className="rounded-xl border border-line bg-card px-3 py-2 text-ink"
          >
            {DEVISES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {info && <p className="text-sm text-ink-muted">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-xl bg-accent px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
