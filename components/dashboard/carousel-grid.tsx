"use client";

import { CarouselCard } from "./carousel-card";

interface CarouselGridProps {
  carousels: Record<string, unknown>[];
  loading: boolean;
  onDelete: (id: string) => void;
  onReload: () => void;
}

export function CarouselGrid({ carousels, loading, onDelete, onReload }: CarouselGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-bg-surface-1 border border-border-subtle rounded-[var(--radius-card)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (carousels.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Nenhum carrossel encontrado</p>
        <p className="text-sm text-text-secondary/60 mt-1">
          Crie seu primeiro carrossel usando os botoes acima
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {carousels.map((carousel) => (
        <CarouselCard
          key={carousel.id as string}
          carousel={carousel}
          onDelete={onDelete}
          onReload={onReload}
        />
      ))}
    </div>
  );
}
