"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCarousels,
  deleteCarouselLocal,
} from "@/lib/local-storage-db";

export function useCarousels(collectionId?: string) {
  const [carousels, setCarousels] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const data = getCarousels(search, collectionId);
    setCarousels(data);
    setLoading(false);
  }, [search, collectionId]);

  useEffect(() => {
    load();
  }, [load]);

  function remove(id: string) {
    deleteCarouselLocal(id);
    setCarousels((prev) => prev.filter((c) => c.id !== id));
  }

  return { carousels, loading, search, setSearch, reload: load, remove };
}
