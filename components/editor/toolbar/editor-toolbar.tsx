"use client";

import { Undo2, Redo2, Plus, Trash2, Copy } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { SLIDE_DIMENSIONS } from "@/lib/editor/editor-types";
import type { SlideFormat } from "@/lib/editor/editor-types";

const formats: { value: SlideFormat; label: string }[] = [
  { value: "carousel", label: "Carrossel 4:5" },
  { value: "square", label: "Quadrado 1:1" },
  { value: "stories", label: "Stories 9:16" },
];

export function EditorToolbar() {
  const {
    format,
    setFormat,
    slides,
    activeSlideIndex,
    addSlide,
    duplicateSlide,
    deleteSlide,
    undo,
    redo,
    history,
  } = useEditorStore();

  const dims = SLIDE_DIMENSIONS[format];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-bg-surface-1 border-b border-border-default">
      <div className="flex items-center gap-2">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as SlideFormat)}
          className="bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1 text-sm text-text-primary focus:outline-none cursor-pointer"
        >
          {formats.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="h-4 w-px bg-border-default mx-1" />

        <button
          onClick={undo}
          disabled={history.past.length === 0}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
          title="Refazer (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>
          Slide {activeSlideIndex + 1} de {slides.length}
        </span>
        <span className="text-xs opacity-60">
          {dims.width}x{dims.height}px
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => duplicateSlide(activeSlideIndex)}
          disabled={slides.length >= 20}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
          title="Duplicar slide"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={addSlide}
          disabled={slides.length >= 20}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
          title="Adicionar slide"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => deleteSlide(activeSlideIndex)}
          disabled={slides.length <= 1}
          className="p-1.5 text-text-secondary hover:text-red-400 disabled:opacity-30 cursor-pointer"
          title="Remover slide"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
