"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCollections,
  createCollectionLocal,
  deleteCollectionLocal,
} from "@/lib/local-storage-db";

export function useCollections() {
  const [collections, setCollections] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const data = getCollections();
    setCollections(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function add(name: string) {
    const collection = createCollectionLocal(name);
    setCollections((prev) => [collection, ...prev]);
    return collection;
  }

  function remove(id: string) {
    deleteCollectionLocal(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }

  return { collections, loading, reload: load, add, remove };
}
