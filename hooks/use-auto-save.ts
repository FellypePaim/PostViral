"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { updateCarouselLocal } from "@/lib/local-storage-db";

export function useAutoSave() {
  const { carouselId, title, slides, format, isDirty, markClean } = useEditorStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty || !carouselId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      updateCarouselLocal(carouselId, {
        title,
        slides_data: { slides, format },
        slide_count: slides.length,
      });
      markClean();
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, carouselId, title, slides, format, markClean]);
}
