"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { SLIDE_DIMENSIONS } from "@/lib/editor/editor-types";
import { captureElementToBlob } from "@/lib/export/dom-to-image";
import { buildSlidesZip, downloadBlob } from "@/lib/export/zip-builder";

export function useExport() {
  const [exporting, setExporting] = useState(false);
  const { slides, format, title } = useEditorStore();
  const dims = SLIDE_DIMENSIONS[format];

  async function exportAll() {
    setExporting(true);
    try {
      const canvasEl = document.querySelector("[data-slide-canvas]") as HTMLElement;
      if (!canvasEl) throw new Error("Canvas nao encontrado");

      const blobs: Blob[] = [];
      for (let i = 0; i < slides.length; i++) {
        useEditorStore.getState().setActiveSlide(i);
        await new Promise((r) => setTimeout(r, 600));
        const blob = await captureElementToBlob(canvasEl, dims.width, dims.height);
        blobs.push(blob);
      }

      const zipBlob = await buildSlidesZip(blobs, title);
      downloadBlob(zipBlob, `carrossel-${Date.now()}.zip`);
    } finally {
      setExporting(false);
    }
  }

  async function exportSingle(index: number) {
    setExporting(true);
    try {
      useEditorStore.getState().setActiveSlide(index);
      await new Promise((r) => setTimeout(r, 600));
      const canvasEl = document.querySelector("[data-slide-canvas]") as HTMLElement;
      if (!canvasEl) return;
      const blob = await captureElementToBlob(canvasEl, dims.width, dims.height);
      const position = index === 0 ? "hook" : index === slides.length - 1 ? "cta" : `slide-${index + 1}`;
      downloadBlob(blob, `${String(index + 1).padStart(2, "0")}-${position}.jpg`);
    } finally {
      setExporting(false);
    }
  }

  return { exportAll, exportSingle, exporting };
}
