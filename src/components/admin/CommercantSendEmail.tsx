"use client";

import { useState, type FormEvent } from "react";
import { sendCommercantEmail } from "@/lib/commercants/admin-actions";

type CommercantSendEmailProps = {
  commercantId: string;
};

const CHAMP = "rounded-xl border border-line bg-page px-3 py-2 text-ink";

export default function CommercantSendEmail({ commercantId }: CommercantSendEmailProps) {
  const [objet, setObjet] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErreur(null);
    setEnvoye(false);

    const { error } = await sendCommercantEmail(commercantId, objet, message);

    setLoading(false);
    if (error) {
      setErreur(error);
      return;
    }
    setEnvoye(true);
    setObjet("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Objet
        <input
          type="text"
          required
          value={objet}
          onChange={(event) => setObjet(event.target.value)}
          className={CHAMP}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Message
        <textarea
          required
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={CHAMP}
        />
      </label>

      {erreur && <p className="text-sm text-status-impaye">{erreur}</p>}
      {envoye && <p className="text-sm text-status-paye">Email envoyé.</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-xl bg-accent px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Envoyer un email"}
      </button>
    </form>
  );
}
