"use client";

import { SlideCanvas } from "./canvas/slide-canvas";
import { EditorToolbar } from "./toolbar/editor-toolbar";
import { ControlsPanel } from "./controls/controls-panel";

export function EditorLayout() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <ControlsPanel />
        <SlideCanvas />
      </div>
    </div>
  );
}
