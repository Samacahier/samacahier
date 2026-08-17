"use client";

import { useState } from "react";
import FournisseurForm from "./FournisseurForm";
import { deleteFournisseur } from "@/lib/fournisseurs/queries";
import type { Fournisseur } from "@/types/database";

type FournisseurListProps = {
  fournisseurs: Fournisseur[];
};

export default function FournisseurList({ fournisseurs }: FournisseurListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce fournisseur ?")) return;

    setDeletingId(id);
    await deleteFournisseur(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fournisseurs</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded bg-black px-3 py-2 text-white"
        >
          {showCreateForm ? "Fermer" : "Nouveau fournisseur"}
        </button>
      </div>

      {showCreateForm && (
        <FournisseurForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {fournisseurs.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun fournisseur enregistré.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nom</th>
              <th className="py-2">Contact</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur) =>
              editingId === fournisseur.id ? (
                <tr key={fournisseur.id}>
                  <td colSpan={3} className="py-2">
                    <FournisseurForm
                      fournisseur={fournisseur}
                      onSuccess={() => setEditingId(null)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={fournisseur.id} className="border-b">
                  <td className="py-2">{fournisseur.nom}</td>
                  <td className="py-2">{fournisseur.contact ?? "—"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(fournisseur.id)}
                        className="underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(fournisseur.id)}
                        disabled={deletingId === fournisseur.id}
                        className="text-red-600 underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
