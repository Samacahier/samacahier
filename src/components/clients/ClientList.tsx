"use client";

import { useState } from "react";
import ClientForm from "./ClientForm";
import { deleteClient } from "@/lib/clients/queries";
import type { Client } from "@/types/database";

type ClientListProps = {
  clients: Client[];
};

export default function ClientList({ clients }: ClientListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce client ?")) return;

    setDeletingId(id);
    await deleteClient(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Clients</h1>
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="rounded-xl bg-accent px-3 py-2 font-medium text-white"
        >
          {showCreateForm ? "Fermer" : "Nouveau client"}
        </button>
      </div>

      {showCreateForm && (
        <ClientForm
          onSuccess={() => setShowCreateForm(false)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {clients.length === 0 ? (
        <p className="text-sm text-ink-muted">Aucun client enregistré.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2 text-ink-muted">Nom</th>
                <th className="py-2 text-ink-muted">Téléphone</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) =>
                editingId === client.id ? (
                  <tr key={client.id}>
                    <td colSpan={3} className="py-2">
                      <ClientForm
                        client={client}
                        onSuccess={() => setEditingId(null)}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={client.id} className="border-b border-line">
                    <td className="py-2">{client.nom}</td>
                    <td className="py-2">{client.telephone ?? "—"}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(client.id)}
                          className="underline"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingId === client.id}
                          className="text-status-impaye underline disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}
