"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { Database, Client } from "@/types/database";

type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];

export type ClientFormInput = Omit<ClientInsert, "id" | "commercant_id" | "created_at">;

export async function listClients(commercantId: string): Promise<Client[]> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("commercant_id", commercantId)
    .order("nom", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createClient(input: ClientFormInput) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié.", client: null };

  const { data: client, error } = await supabase
    .from("clients")
    .insert({ ...input, commercant_id: user.id })
    .select()
    .single();

  if (error) return { error: error.message, client: null };

  revalidatePath("/clients");
  revalidatePath("/ventes");
  return { error: null, client };
}

export async function updateClient(id: string, input: Partial<ClientFormInput>) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("clients").update(input).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/clients");
  return { error: null };
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/clients");
  return { error: null };
}
