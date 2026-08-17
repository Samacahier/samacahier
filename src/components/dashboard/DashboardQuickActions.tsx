"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import VenteForm from "@/components/ventes/VenteForm";
import DepenseForm from "@/components/depenses/DepenseForm";
import type { Client, Fournisseur, Stock } from "@/types/database";

type DashboardQuickActionsProps = {
  produits: Stock[];
  clients: Client[];
  fournisseurs: Fournisseur[];
};

export default function DashboardQuickActions({
  produits,
  clients,
  fournisseurs,
}: DashboardQuickActionsProps) {
  const router = useRouter();
  const [modalOuvert, setModalOuvert] = useState<"vente" | "depense" | null>(null);
  const [menuOuvert, setMenuOuvert] = useState(false);

  function handleSuccess() {
    setModalOuvert(null);
    setMenuOuvert(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setModalOuvert("vente")}
          className="flex-1 rounded bg-black px-3 py-2 text-white"
        >
          Nouvelle vente
        </button>
        <button
          type="button"
          onClick={() => setModalOuvert("depense")}
          className="flex-1 rounded border px-3 py-2"
        >
          Dépense
        </button>
      </div>

      <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2">
        {menuOuvert && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setModalOuvert("vente");
                setMenuOuvert(false);
              }}
              className="rounded-full bg-black px-4 py-2 text-sm text-white shadow"
            >
              Nouvelle vente
            </button>
            <button
              type="button"
              onClick={() => {
                setModalOuvert("depense");
                setMenuOuvert(false);
              }}
              className="rounded-full bg-black px-4 py-2 text-sm text-white shadow"
            >
              Nouvelle dépense
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMenuOuvert((value) => !value)}
          aria-label="Actions rapides"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg"
        >
          {menuOuvert ? "×" : "+"}
        </button>
      </div>

      {modalOuvert === "vente" && (
        <Modal title="Nouvelle vente" onClose={() => setModalOuvert(null)}>
          <VenteForm
            produits={produits}
            clients={clients}
            onSuccess={handleSuccess}
            onCancel={() => setModalOuvert(null)}
          />
        </Modal>
      )}

      {modalOuvert === "depense" && (
        <Modal title="Nouvelle dépense" onClose={() => setModalOuvert(null)}>
          <DepenseForm
            fournisseurs={fournisseurs}
            onSuccess={handleSuccess}
            onCancel={() => setModalOuvert(null)}
          />
        </Modal>
      )}
    </>
  );
}
