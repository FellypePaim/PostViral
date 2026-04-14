"use client";

import { useRouter } from "next/navigation";
import { Trash2, Image as ImageIcon, Copy, FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createCarousel, getCarousel } from "@/lib/local-storage-db";

interface CarouselCardProps {
  carousel: Record<string, unknown>;
  onDelete: (id: string) => void;
  onReload: () => void;
}

export function CarouselCard({ carousel, onDelete, onReload }: CarouselCardProps) {
  const router = useRouter();

  function formatTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min atras`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atras`;
    const days = Math.floor(hours / 24);
    return `${days}d atras`;
  }

  function handleDuplicate() {
    const original = getCarousel(carousel.id as string);
    if (original) {
      createCarousel({
        ...original,
        title: `${original.title || "Sem titulo"} (copia)`,
      });
      onReload();
    }
  }

  const style = (carousel.post_style as string) || "Minimalista";

  return (
    <Card className="overflow-hidden group">
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/gerador?id=${carousel.id}`)}
      >
        <div className="aspect-[4/5] bg-bg-surface-2 flex items-center justify-center relative">
          {carousel.thumbnail ? (
            <img
              src={carousel.thumbnail as string}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <ImageIcon size={28} className="text-text-secondary/20 mx-auto" />
              <span className="text-xs text-text-secondary/30 mt-1 block">Sem preview</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="text-[10px] bg-bg-primary/80 backdrop-blur-sm text-text-secondary px-1.5 py-0.5 rounded-md">
              {style}
            </span>
            <span className="text-[10px] bg-bg-primary/80 backdrop-blur-sm text-text-secondary px-1.5 py-0.5 rounded-md">
              {(carousel.slide_count as number) || 1} slides
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-text-primary truncate">
          {(carousel.title as string) || "Sem titulo"}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          {formatTime(carousel.updated_at as string)}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border-subtle">
          <button
            onClick={() => router.push(`/gerador?id=${carousel.id}`)}
            className="flex-1 text-xs py-1.5 text-center text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-md transition-colors cursor-pointer"
          >
            Abrir
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-md transition-colors cursor-pointer"
            title="Duplicar"
          >
            <Copy size={13} />
          </button>
          <button
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-md transition-colors cursor-pointer"
            title="Mover para pasta"
          >
            <FolderOpen size={13} />
          </button>
          <button
            onClick={() => onDelete(carousel.id as string)}
            className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-bg-surface-2 rounded-md transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </Card>
  );
}
