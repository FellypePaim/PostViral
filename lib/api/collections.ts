import { authFetch } from "@/lib/auth-fetch";
import type { Database } from "@/types/database";

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export async function fetchCollections(): Promise<Collection[]> {
  const res = await authFetch("/api/collections");
  if (!res.ok) throw new Error("Erro ao carregar colecoes");
  return res.json();
}

export async function createCollection(name: string): Promise<Collection> {
  const res = await authFetch("/api/collections", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Erro ao criar colecao");
  return res.json();
}

export async function updateCollection(id: string, name: string): Promise<Collection> {
  const res = await authFetch(`/api/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar colecao");
  return res.json();
}

export async function deleteCollection(id: string): Promise<void> {
  const res = await authFetch(`/api/collections/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir colecao");
}
