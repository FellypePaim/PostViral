"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useAutoSave } from "@/hooks/use-auto-save";
import { EditorLayout } from "@/components/editor/editor-layout";
import { getCarousel, createCarousel } from "@/lib/local-storage-db";
import { Spinner } from "@/components/ui/spinner";

function EditorLoader() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = searchParams.get("new");
  const { initEditor, carouselId } = useEditorStore();

  useKeyboardShortcuts();
  useAutoSave();

  useEffect(() => {
    if (isNew) {
      const carousel = createCarousel({ title: "Sem titulo" });
      initEditor(carousel.id as string, "Sem titulo");
      window.history.replaceState(null, "", `/gerador?id=${carousel.id}`);
      return;
    }

    if (id && id !== carouselId) {
      const carousel = getCarousel(id);
      if (carousel) {
        const data = carousel.slides_data as { slides?: unknown[]; format?: string } | null;
        initEditor(
          carousel.id as string,
          (carousel.title as string) || "Sem titulo",
          data?.slides as never[] | undefined
        );
      } else {
        initEditor(null, "Sem titulo");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  return <EditorLayout />;
}

export default function GeradorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner size={32} className="text-text-secondary" />
        </div>
      }
    >
      <EditorLoader />
    </Suspense>
  );
}
