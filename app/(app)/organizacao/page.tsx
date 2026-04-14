"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useCollections } from "@/hooks/use-collections";
import { useCarousels } from "@/hooks/use-carousels";
import { CollectionList } from "@/components/collections/collection-list";
import { CarouselGrid } from "@/components/dashboard/carousel-grid";
import { useToast } from "@/components/ui/toast";

export default function OrganizacaoPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { collections, add, remove: removeCollection } = useCollections();
  const { carousels, loading, search, setSearch, reload, remove: removeCarousel } = useCarousels(selectedCollection || undefined);
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");

  async function handleAddCollection(name: string) {
    add(name);
    toast("Pasta criada", "success");
  }

  async function handleDeleteCollection(id: string) {
    removeCollection(id);
    if (selectedCollection === id) setSelectedCollection(null);
    toast("Pasta excluida", "success");
  }

  async function handleDeleteCarousel(id: string) {
    removeCarousel(id);
    toast("Carrossel excluido", "success");
  }

  const collectionName = selectedCollection
    ? (collections.find((c) => c.id === selectedCollection)?.name as string) || "Pasta"
    : "Todos os posts";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organizacao</h1>
        <p className="text-text-secondary text-sm mt-1">
          Organize seus carrosseis em pastas
        </p>
      </div>

      <div className="flex gap-6 min-h-[500px]">
        <CollectionList
          collections={collections}
          selected={selectedCollection}
          onSelect={setSelectedCollection}
          onAdd={handleAddCollection}
          onDelete={handleDeleteCollection}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">
              {collectionName} ({carousels.length})
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Pesquisar posts..."
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setSearch(e.target.value); }}
                className="w-48 pl-8 pr-3 py-1.5 bg-bg-surface-1 border border-border-default rounded-lg text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
              />
            </div>
          </div>
          <CarouselGrid
            carousels={carousels}
            loading={loading}
            onDelete={handleDeleteCarousel}
            onReload={reload}
          />
        </div>
      </div>
    </div>
  );
}
