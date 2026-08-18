"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleCommercantActif } from "@/lib/commercants/admin-actions";

type CommercantToggleActifProps = {
  commercantId: string;
  actif: boolean;
};

export default function CommercantToggleActif({
  commercantId,
  actif,
}: CommercantToggleActifProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const confirmation = actif
      ? "Désactiver ce compte ? Il ne pourra plus se connecter tant qu'il n'est pas réactivé."
      : "Réactiver ce compte ?";
    if (!window.confirm(confirmation)) return;

    setLoading(true);
    await toggleCommercantActif(commercantId, !actif);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-xl px-4 py-2 font-medium disabled:opacity-50 ${
        actif ? "bg-status-impaye-bg text-status-impaye" : "bg-status-paye-bg text-status-paye"
      }`}
    >
      {loading ? "..." : actif ? "Désactiver le compte" : "Réactiver le compte"}
    </button>
  );
}
