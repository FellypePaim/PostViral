import { authFetch } from "@/lib/auth-fetch";
import type { Database } from "@/types/database";

type Carousel = Database["public"]["Tables"]["carousels"]["Row"];
type CarouselInsert = Database["public"]["Tables"]["carousels"]["Insert"];

export async function fetchCarousels(search?: string, collectionId?: string): Promise<Carousel[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (collectionId) params.set("collection_id", collectionId);

  const url = `/api/carousels${params.toString() ? `?${params}` : ""}`;
  const res = await authFetch(url);

  if (!res.ok) throw new Error("Erro ao carregar carrosseis");
  return res.json();
}

export async function fetchCarousel(id: string): Promise<Carousel> {
  const res = await authFetch(`/api/carousels/${id}`);
  if (!res.ok) throw new Error("Carrossel nao encontrado");
  return res.json();
}

export async function createCarousel(data: Partial<CarouselInsert>): Promise<Carousel> {
  const res = await authFetch("/api/carousels", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar carrossel");
  return res.json();
}

export async function updateCarousel(id: string, data: Partial<Carousel>): Promise<Carousel> {
  const res = await authFetch(`/api/carousels/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar carrossel");
  return res.json();
}

export async function deleteCarousel(id: string): Promise<void> {
  const res = await authFetch(`/api/carousels/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir carrossel");
}
