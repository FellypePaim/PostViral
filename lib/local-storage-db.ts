import { getSession } from "./local-auth";

function getUserId(): string | null {
  const session = getSession();
  return session?.user_id || null;
}

function getStore<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Carousels
export function getCarousels(search?: string, collectionId?: string) {
  const userId = getUserId();
  if (!userId) return [];
  let items = getStore<Record<string, unknown>>("app_carousels").filter(
    (c) => c.user_id === userId
  );
  if (search) {
    items = items.filter((c) =>
      ((c.title as string) || "").toLowerCase().includes(search.toLowerCase())
    );
  }
  if (collectionId) {
    items = items.filter((c) => c.collection_id === collectionId);
  }
  return items.sort(
    (a, b) =>
      new Date(b.updated_at as string).getTime() -
      new Date(a.updated_at as string).getTime()
  );
}

export function getCarousel(id: string) {
  const all = getStore<Record<string, unknown>>("app_carousels");
  return all.find((c) => c.id === id) || null;
}

export function createCarousel(data: Record<string, unknown>) {
  const userId = getUserId();
  if (!userId) throw new Error("Nao autenticado");
  const all = getStore<Record<string, unknown>>("app_carousels");
  const item = {
    id: `car-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user_id: userId,
    title: data.title || "Sem titulo",
    topic: data.topic || null,
    post_style: data.post_style || "minimalista",
    slide_count: data.slide_count || 1,
    thumbnail: data.thumbnail || null,
    collection_id: data.collection_id || null,
    slides_data: data.slides_data || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  all.push(item);
  setStore("app_carousels", all);
  return item;
}

export function updateCarouselLocal(id: string, updates: Record<string, unknown>) {
  const all = getStore<Record<string, unknown>>("app_carousels");
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
  setStore("app_carousels", all);
  return all[index];
}

export function deleteCarouselLocal(id: string) {
  const all = getStore<Record<string, unknown>>("app_carousels");
  setStore(
    "app_carousels",
    all.filter((c) => c.id !== id)
  );
}

// Collections
export function getCollections() {
  const userId = getUserId();
  if (!userId) return [];
  return getStore<Record<string, unknown>>("app_collections")
    .filter((c) => c.user_id === userId)
    .sort(
      (a, b) =>
        new Date(b.created_at as string).getTime() -
        new Date(a.created_at as string).getTime()
    );
}

export function createCollectionLocal(name: string) {
  const userId = getUserId();
  if (!userId) throw new Error("Nao autenticado");
  const all = getStore<Record<string, unknown>>("app_collections");
  const item = {
    id: `col-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user_id: userId,
    name,
    created_at: new Date().toISOString(),
  };
  all.push(item);
  setStore("app_collections", all);
  return item;
}

export function deleteCollectionLocal(id: string) {
  const all = getStore<Record<string, unknown>>("app_collections");
  setStore(
    "app_collections",
    all.filter((c) => c.id !== id)
  );
  // Remove collection_id from carousels
  const carousels = getStore<Record<string, unknown>>("app_carousels");
  carousels.forEach((c) => {
    if (c.collection_id === id) c.collection_id = null;
  });
  setStore("app_carousels", carousels);
}
