"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";

export function useKeyboardShortcuts() {
  const { undo, redo, deleteSlide, activeSlideIndex, slides } = useEditorStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" && slides.length > 1) {
        e.preventDefault();
        deleteSlide(activeSlideIndex);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteSlide, activeSlideIndex, slides.length]);
}
