"use client";

import { useEditorStore } from "@/stores/editor-store";
import { SLIDE_DIMENSIONS } from "@/lib/editor/editor-types";
import { Trash2, GripVertical, Plus } from "lucide-react";

export function SlideCanvas() {
  const { slides, activeSlideIndex, setActiveSlide, addSlide, deleteSlide, format, isDirty } = useEditorStore();
  const dims = SLIDE_DIMENSIONS[format];
  const maxH = 520;
  const scale = Math.min(380 / dims.width, maxH / dims.height);

  function renderSlide(slide: (typeof slides)[0], index: number) {
    const isActive = index === activeSlideIndex;

    const positionStyles: Record<string, string> = {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      center: "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-left": "items-end justify-start",
      "bottom-center": "items-end justify-center",
      "bottom-right": "items-end justify-end",
    };

    function getOverlay() {
      if (slide.overlay.type === "none") return {};
      const o = slide.overlay.opacity / 100;
      switch (slide.overlay.type) {
        case "gradient": return { background: `linear-gradient(to top, rgba(0,0,0,${o}), transparent)` };
        case "vignette": return { boxShadow: `inset 0 0 80px rgba(0,0,0,${o})` };
        case "base": return { background: `linear-gradient(to top, rgba(0,0,0,${o}) 30%, transparent 70%)` };
        case "top": return { background: `linear-gradient(to bottom, rgba(0,0,0,${o}) 30%, transparent 70%)` };
        case "frame": return { boxShadow: `inset 0 0 50px 20px rgba(0,0,0,${o})` };
        case "diagonal": return { background: `linear-gradient(135deg, rgba(0,0,0,${o}), transparent)` };
        default: return {};
      }
    }

    function getPattern() {
      const c = "rgba(255,255,255,0.05)";
      switch (slide.pattern.type) {
        case "grid": return { backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`, backgroundSize: "30px 30px" };
        case "dots": return { backgroundImage: `radial-gradient(circle, ${c} 1px, transparent 1px)`, backgroundSize: "16px 16px" };
        case "lines-h": return { backgroundImage: `linear-gradient(${c} 1px, transparent 1px)`, backgroundSize: "100% 16px" };
        case "lines-d": return { backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, ${c} 8px, ${c} 9px)` };
        case "checker": return { backgroundImage: `linear-gradient(45deg, ${c} 25%, transparent 25%), linear-gradient(-45deg, ${c} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c} 75%), linear-gradient(-45deg, transparent 75%, ${c} 75%)`, backgroundSize: "30px 30px", backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px" };
        default: return {};
      }
    }

    return (
      <div
        key={slide.id}
        className={`shrink-0 relative group cursor-pointer transition-all ${isActive ? "ring-2 ring-accent-bg ring-offset-2 ring-offset-bg-primary" : "opacity-70 hover:opacity-90"}`}
        onClick={() => setActiveSlide(index)}
      >
        {/* Slide number + controls */}
        <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <GripVertical size={12} className="opacity-0 group-hover:opacity-100 cursor-grab" />
            <span className="font-medium">{index + 1}</span>
          </div>
          {slides.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {/* Slide content */}
        <div
          className="relative overflow-hidden rounded-lg shadow-lg"
          style={{
            width: dims.width * scale,
            height: dims.height * scale,
            backgroundColor: slide.background.color,
          }}
          data-slide-canvas={isActive ? "active" : undefined}
        >
          {slide.background.type === "image" && slide.background.imageUrl && (
            <img src={slide.background.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `${slide.background.posX}% ${slide.background.posY}%`, transform: `scale(${slide.background.zoom / 100})` }} />
          )}
          <div className="absolute inset-0" style={getPattern()} />
          <div className="absolute inset-0" style={getOverlay()} />

          <div
            className={`absolute inset-0 flex flex-col ${positionStyles[slide.layout.position] || "items-center justify-center"}`}
            style={{ padding: `${slide.layout.marginV * scale}px ${slide.layout.marginH * scale}px`, transform: `scale(${slide.layout.scale / 100})` }}
          >
            <div className={`${slide.layout.alignment === "left" ? "text-left" : slide.layout.alignment === "right" ? "text-right" : "text-center"} ${slide.layout.glass ? "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4" : ""}`}>
              {slide.title.text && (
                <h2 style={{ fontSize: slide.title.fontSize * scale, fontFamily: slide.title.fontFamily, fontWeight: slide.title.fontWeight, color: slide.title.color, letterSpacing: slide.title.letterSpacing, lineHeight: 1.2 }}>
                  {slide.title.text}
                </h2>
              )}
              {slide.subtitle.text && (
                <p style={{ fontSize: slide.subtitle.fontSize * scale, fontFamily: slide.subtitle.fontFamily, fontWeight: slide.subtitle.fontWeight, color: slide.subtitle.color, lineHeight: slide.subtitle.lineHeight, marginTop: 6 * scale }}>
                  {slide.subtitle.text}
                </p>
              )}
            </div>
          </div>

          {/* Badge corners */}
          {slide.badge.show && (
            <div className="absolute inset-0 pointer-events-none" style={{ padding: slide.badge.borderDistance * scale, opacity: slide.badge.opacity / 100, fontSize: slide.badge.fontSize * scale }}>
              {slide.badge.corners.topLeft.show && <span className="absolute top-0 left-0 text-white/80" style={{ padding: slide.badge.borderDistance * scale }}>{slide.badge.corners.topLeft.text}</span>}
              {slide.badge.corners.topRight.show && <span className="absolute top-0 right-0 text-white/80" style={{ padding: slide.badge.borderDistance * scale }}>{slide.badge.corners.topRight.text}</span>}
              {slide.badge.corners.bottomLeft.show && <span className="absolute bottom-0 left-0 text-white/80" style={{ padding: slide.badge.borderDistance * scale }}>{slide.badge.corners.bottomLeft.text}</span>}
              {slide.badge.corners.bottomRight.show && <span className="absolute bottom-0 right-0 text-white/80" style={{ padding: slide.badge.borderDistance * scale }}>{slide.badge.corners.bottomRight.text}</span>}
            </div>
          )}

          {slide.cta.show && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="bg-white/10 backdrop-blur-sm text-white/80 px-2.5 py-0.5 rounded-full" style={{ fontSize: 10 * scale }}>{slide.cta.text}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-primary">
      {/* Slides scroll area */}
      <div className="flex-1 flex items-center overflow-x-auto px-8 gap-8 py-10">
        {slides.map((slide, i) => renderSlide(slide, i))}

        {slides.length < 20 && (
          <button
            onClick={addSlide}
            className="shrink-0 flex items-center justify-center border-2 border-dashed border-border-default rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors cursor-pointer"
            style={{ width: dims.width * scale, height: dims.height * scale }}
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* Status bar */}
      <div className="h-7 border-t border-border-default flex items-center px-4 text-[11px] text-text-secondary gap-4 bg-bg-surface-1">
        <span>Slide {activeSlideIndex + 1}/{slides.length}</span>
        <span>{dims.width}x{dims.height} px</span>
        <span>{slides[activeSlideIndex]?.darkMode ? "Escuro" : "Claro"}</span>
        <span className="ml-auto">{isDirty ? "Salvando..." : "Salvo"}</span>
      </div>
    </div>
  );
}
