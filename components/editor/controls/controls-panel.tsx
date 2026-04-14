"use client";

import { useEditorStore } from "@/stores/editor-store";
import { EDITOR_FONTS, OVERLAY_TYPES, PATTERN_TYPES, HIGHLIGHT_COLORS } from "@/lib/editor/slide-defaults";
import { Accordion } from "@/components/ui/accordion";
import { Sparkles, Download, Save, Rocket } from "lucide-react";
import { PublishModal } from "@/components/editor/publish/publish-modal";
import { Button } from "@/components/ui/button";
import { useExport } from "@/hooks/use-export";
import { useState } from "react";

const POSITIONS = ["top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"];
const COLOR_PALETTE = ["#ffffff", "#000000", "#facc15", "#ef4444", "#3b82f6", "#22c55e", "#f97316", "#a855f7", "#6b7280"];

export function ControlsPanel() {
  const { slides, activeSlideIndex, updateSlide, updateSlideDeep, pushHistory } = useEditorStore();
  const { exportAll, exportSingle, exporting } = useExport();
  const [captionModal, setCaptionModal] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const slide = slides[activeSlideIndex];

  if (!slide) return null;

  function change<K extends keyof typeof slide>(key: K, updates: Partial<(typeof slide)[K]>) {
    pushHistory();
    updateSlideDeep(activeSlideIndex, key, updates);
  }

  return (
    <div className="w-80 shrink-0 border-l border-border-default bg-bg-surface-1 flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3">
        {/* Style tabs */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => { pushHistory(); updateSlide(activeSlideIndex, { darkMode: true }); change("background", { color: "#0a0a0a" }); change("title", { color: "#ffffff" }); }}
            className={`flex-1 py-1.5 text-xs rounded-lg border cursor-pointer ${slide.darkMode ? "border-accent-bg bg-accent-bg/10 text-text-primary" : "border-border-default text-text-secondary"}`}
          >
            Escuro
          </button>
          <button
            onClick={() => { pushHistory(); updateSlide(activeSlideIndex, { darkMode: false }); change("background", { color: "#ffffff" }); change("title", { color: "#000000" }); change("subtitle", { color: "#666666" }); }}
            className={`flex-1 py-1.5 text-xs rounded-lg border cursor-pointer ${!slide.darkMode ? "border-accent-bg bg-accent-bg/10 text-text-primary" : "border-border-default text-text-secondary"}`}
          >
            Claro
          </button>
        </div>

        {/* Gerar com IA */}
        <Accordion title="Gerar com IA">
          <textarea placeholder="Descreva o tema do carrossel..." className="w-full bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary resize-none h-16" />
          <Button size="sm" className="w-full">
            <Sparkles size={13} className="mr-1.5" /> Gerar slides
          </Button>
          <div className="border-t border-border-subtle pt-3 mt-1">
            <p className="text-xs text-text-secondary mb-2">Ou melhore o conteudo atual:</p>
            <textarea placeholder="Ex: deixe os titulos mais diretos e impactantes..." className="w-full bg-bg-surface-2 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary resize-none h-12" />
            <Button size="sm" variant="secondary" className="w-full mt-2">
              <Sparkles size={13} className="mr-1.5" /> Melhorar Conteudo
            </Button>
          </div>
        </Accordion>

        {/* Identidade Visual */}
        <Accordion title="Identidade Visual">
          <div className="grid grid-cols-3 gap-2">
            {[{ label: "Fundo", key: "background" as const, prop: "color", val: slide.background.color },
              { label: "Titulo", key: "title" as const, prop: "color", val: slide.title.color },
              { label: "Subtitulo", key: "subtitle" as const, prop: "color", val: slide.subtitle.color }].map((item) => (
              <div key={item.label}>
                <label className="text-xs text-text-secondary">{item.label}</label>
                <div className="flex items-center gap-1 mt-1">
                  <input type="color" value={item.val} onChange={(e) => change(item.key, { [item.prop]: e.target.value } as never)} className="w-7 h-7 rounded border border-border-default cursor-pointer" />
                  <input type="text" value={item.val} onChange={(e) => change(item.key, { [item.prop]: e.target.value } as never)} className="flex-1 bg-bg-surface-2 border border-border-default rounded px-1.5 py-0.5 text-[10px] text-text-primary w-0" />
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" variant="secondary" className="w-full mt-1">Aplicar em todos</Button>
        </Accordion>

        <h4 className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest mt-4 mb-2">
          Conteudo - Slide {activeSlideIndex + 1}
        </h4>

        {/* Imagem de Fundo */}
        <Accordion title="Imagem de Fundo">
          <div className="border border-dashed border-border-default rounded-lg p-4 text-center text-xs text-text-secondary cursor-pointer hover:border-text-secondary">
            Clique ou arraste uma imagem
          </div>
          <Button size="sm" variant="secondary" className="w-full">
            <Sparkles size={13} className="mr-1.5" /> Gerar Imagem com IA
          </Button>
          <Slider label="Posicao X" value={slide.background.posX} min={0} max={100} onChange={(v) => change("background", { posX: v })} />
          <Slider label="Posicao Y" value={slide.background.posY} min={0} max={100} onChange={(v) => change("background", { posY: v })} />
          <Slider label="Zoom" value={slide.background.zoom} min={100} max={300} onChange={(v) => change("background", { zoom: v })} suffix="%" />
        </Accordion>

        {/* Sombra / Overlay */}
        <Accordion title="Sombra / Overlay">
          <select value={slide.overlay.type} onChange={(e) => change("overlay", { type: e.target.value as never })} className="w-full bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary">
            {OVERLAY_TYPES.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
          <Slider label="Opacidade" value={slide.overlay.opacity} min={0} max={100} onChange={(v) => change("overlay", { opacity: v })} suffix="%" />
        </Accordion>

        {/* Fundo do Slide */}
        <Accordion title="Fundo do Slide">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-secondary">Cor</label>
            <input type="color" value={slide.background.color} onChange={(e) => change("background", { color: e.target.value })} className="w-7 h-7 rounded border border-border-default cursor-pointer" />
            <input type="text" value={slide.background.color} onChange={(e) => change("background", { color: e.target.value })} className="flex-1 bg-bg-surface-2 border border-border-default rounded px-2 py-1 text-xs text-text-primary" />
          </div>
          <div>
            <label className="text-xs text-text-secondary">Padrao sobre o fundo</label>
            <div className="grid grid-cols-3 gap-1 mt-1">
              {PATTERN_TYPES.map((p) => (
                <button key={p.value} onClick={() => change("pattern", { type: p.value as never })} className={`py-1.5 text-[10px] rounded border cursor-pointer ${slide.pattern.type === p.value ? "border-accent-bg bg-accent-bg/10 text-text-primary" : "border-border-default text-text-secondary"}`}>{p.label}</button>
              ))}
            </div>
          </div>
        </Accordion>

        {/* Titulo & Subtitulo */}
        <Accordion title="Titulo & Subtitulo" defaultOpen>
          <div className="space-y-3">
            <Slider label="Margem H" value={slide.layout.marginH} min={0} max={100} onChange={(v) => change("layout", { marginH: v })} suffix="px" />
            <Slider label="Margem V" value={slide.layout.marginV} min={0} max={100} onChange={(v) => change("layout", { marginV: v })} suffix="px" />

            {/* Position grid */}
            <div>
              <label className="text-xs text-text-secondary">Posicao</label>
              <div className="grid grid-cols-3 gap-1 mt-1">
                {POSITIONS.map((pos) => (
                  <button key={pos} onClick={() => change("layout", { position: pos })} className={`aspect-square rounded border cursor-pointer text-[8px] ${slide.layout.position === pos ? "bg-accent-bg border-accent-bg text-accent-text" : "bg-bg-surface-2 border-border-default text-transparent hover:border-text-secondary"}`}>
                    {pos === slide.layout.position ? "X" : "."}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment */}
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((a) => (
                <button key={a} onClick={() => change("layout", { alignment: a })} className={`flex-1 py-1.5 text-xs rounded cursor-pointer ${slide.layout.alignment === a ? "bg-accent-bg text-accent-text" : "bg-bg-surface-2 text-text-secondary"}`}>
                  {a === "left" ? "Esq." : a === "center" ? "Centro" : "Dir."}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
              <input type="checkbox" checked={slide.layout.glass} onChange={(e) => change("layout", { glass: e.target.checked })} className="rounded accent-white" />
              Glass ao redor do conteudo
            </label>

            {/* Title text */}
            <div>
              <label className="text-xs text-text-secondary">Titulo</label>
              <textarea value={slide.title.text} onChange={(e) => change("title", { text: e.target.value })} className="w-full mt-1 bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary resize-none" rows={2} />
            </div>

            {/* Subtitle text */}
            <div>
              <label className="text-xs text-text-secondary">Subtitulo</label>
              <textarea value={slide.subtitle.text} onChange={(e) => change("subtitle", { text: e.target.value })} className="w-full mt-1 bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary resize-none" rows={2} />
            </div>

            <Button size="sm" variant="secondary" className="w-full">
              <Sparkles size={13} className="mr-1.5" /> Gerar conteudo deste slide com IA
            </Button>

            {/* Refine */}
            <div>
              <label className="text-xs text-text-secondary">Refinar slide com IA</label>
              <textarea placeholder="Ex: deixe mais agressivo, encurte o subtitulo..." className="w-full mt-1 bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary resize-none" rows={2} />
              <Button size="sm" variant="secondary" className="w-full mt-1">
                <Sparkles size={13} className="mr-1.5" /> Refinar este slide
              </Button>
            </div>

            <Slider label="Escala global" value={slide.layout.scale} min={50} max={200} onChange={(v) => change("layout", { scale: v })} suffix="%" />

            {/* Title controls */}
            <h5 className="text-[10px] font-bold text-text-secondary/60 uppercase mt-2">Titulo</h5>
            <Slider label="Tamanho" value={slide.title.fontSize} min={12} max={120} onChange={(v) => change("title", { fontSize: v })} suffix="px" />
            <div>
              <label className="text-xs text-text-secondary">Fonte</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {EDITOR_FONTS.map((f) => (
                  <button key={f} onClick={() => change("title", { fontFamily: f })} className={`px-2 py-1 text-[10px] rounded border cursor-pointer ${slide.title.fontFamily === f ? "border-accent-bg bg-accent-bg/10 text-text-primary" : "border-border-default text-text-secondary"}`} style={{ fontFamily: f }}>{f.split(" ")[0]}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary">Peso</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                  <button key={w} onClick={() => change("title", { fontWeight: w })} className={`px-2 py-1 text-[10px] rounded border cursor-pointer ${slide.title.fontWeight === w ? "border-accent-bg bg-accent-bg/10" : "border-border-default text-text-secondary"}`}>{w}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary">Cor do titulo</label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {COLOR_PALETTE.map((c) => (
                  <button key={c} onClick={() => change("title", { color: c })} className={`w-6 h-6 rounded-full border-2 cursor-pointer ${slide.title.color === c ? "border-accent-bg scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={slide.title.color} onChange={(e) => change("title", { color: e.target.value })} className="w-6 h-6 rounded-full border border-border-default cursor-pointer" />
              </div>
            </div>
            <Slider label="Espacamento" value={slide.title.letterSpacing} min={-5} max={20} onChange={(v) => change("title", { letterSpacing: v })} />

            {/* Subtitle controls */}
            <h5 className="text-[10px] font-bold text-text-secondary/60 uppercase mt-2">Subtitulo</h5>
            <Slider label="Tamanho" value={slide.subtitle.fontSize} min={10} max={60} onChange={(v) => change("subtitle", { fontSize: v })} suffix="px" />
            <div>
              <label className="text-xs text-text-secondary">Fonte</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {EDITOR_FONTS.map((f) => (
                  <button key={f} onClick={() => change("subtitle", { fontFamily: f })} className={`px-2 py-1 text-[10px] rounded border cursor-pointer ${slide.subtitle.fontFamily === f ? "border-accent-bg bg-accent-bg/10 text-text-primary" : "border-border-default text-text-secondary"}`}>{f.split(" ")[0]}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary">Cor do subtitulo</label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {COLOR_PALETTE.map((c) => (
                  <button key={c} onClick={() => change("subtitle", { color: c })} className={`w-6 h-6 rounded-full border-2 cursor-pointer ${slide.subtitle.color === c ? "border-accent-bg scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={slide.subtitle.color} onChange={(e) => change("subtitle", { color: e.target.value })} className="w-6 h-6 rounded-full border border-border-default cursor-pointer" />
              </div>
            </div>
            <Slider label="Entre linhas" value={Math.round(slide.subtitle.lineHeight * 10)} min={10} max={30} onChange={(v) => change("subtitle", { lineHeight: v / 10 })} />

            {/* Word highlight */}
            <h5 className="text-[10px] font-bold text-text-secondary/60 uppercase mt-2">Destaque de palavra</h5>
            <div className="flex gap-1 flex-wrap">
              {HIGHLIGHT_COLORS.map((c) => (
                <button key={c.value} className="w-6 h-6 rounded-full border border-border-default cursor-pointer" style={{ backgroundColor: c.value }} title={c.name} />
              ))}
            </div>
          </div>
        </Accordion>

        {/* Badge */}
        <Accordion title="Badge / Perfil">
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input type="checkbox" checked={slide.badge.show} onChange={(e) => change("badge", { show: e.target.checked })} className="rounded accent-white" /> Exibir - slide {activeSlideIndex + 1}
          </label>
          {slide.badge.show && (
            <div className="space-y-2 mt-2">
              {(Object.keys(slide.badge.corners) as Array<keyof typeof slide.badge.corners>).map((corner) => {
                const labels: Record<string, string> = { topLeft: "Sup. Esq.", topRight: "Sup. Dir.", bottomLeft: "Inf. Esq.", bottomRight: "Inf. Dir." };
                return (
                  <div key={corner} className="flex items-center gap-1.5">
                    <input type="checkbox" checked={slide.badge.corners[corner].show} onChange={(e) => {
                      const c = { ...slide.badge.corners }; c[corner] = { ...c[corner], show: e.target.checked }; change("badge", { corners: c });
                    }} className="rounded accent-white shrink-0" />
                    <span className="text-[10px] text-text-secondary w-12 shrink-0">{labels[corner]}</span>
                    <input type="text" value={slide.badge.corners[corner].text} onChange={(e) => {
                      const c = { ...slide.badge.corners }; c[corner] = { ...c[corner], text: e.target.value }; change("badge", { corners: c });
                    }} className="flex-1 bg-bg-surface-2 border border-border-default rounded px-2 py-1 text-xs text-text-primary" />
                  </div>
                );
              })}
              <Slider label="Fonte" value={slide.badge.fontSize} min={8} max={24} onChange={(v) => change("badge", { fontSize: v })} suffix="px" />
              <Slider label="Bordas" value={slide.badge.borderDistance} min={8} max={60} onChange={(v) => change("badge", { borderDistance: v })} suffix="px" />
              <Slider label="Opacidade" value={slide.badge.opacity} min={0} max={100} onChange={(v) => change("badge", { opacity: v })} suffix="%" />
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input type="checkbox" checked={slide.badge.glass} onChange={(e) => change("badge", { glass: e.target.checked })} className="rounded accent-white" /> Glass
              </label>
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input type="checkbox" checked={slide.badge.indicators} onChange={(e) => change("badge", { indicators: e.target.checked })} className="rounded accent-white" /> Indicadores (bolinhas)
              </label>
            </div>
          )}
        </Accordion>

        {/* CTA */}
        <Accordion title="Botoes / CTAs">
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input type="checkbox" checked={slide.cta.show} onChange={(e) => change("cta", { show: e.target.checked })} className="rounded accent-white" /> Mostrar CTA
          </label>
          {slide.cta.show && (
            <input type="text" value={slide.cta.text} onChange={(e) => change("cta", { text: e.target.value })} className="w-full bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-sm text-text-primary" />
          )}
        </Accordion>

        {/* Templates */}
        <Accordion title="Templates de Estilo">
          <p className="text-xs text-text-secondary">Salve o estilo visual atual para reutilizar em novos carrosseis.</p>
          <div className="flex gap-1.5">
            <input type="text" placeholder="Ex: Meu estilo principal" className="flex-1 bg-bg-surface-2 border border-border-default rounded-lg px-2 py-1.5 text-xs text-text-primary" />
            <Button size="sm"><Save size={13} /></Button>
          </div>
          <p className="text-xs text-text-secondary/50 italic">Nenhum template salvo ainda.</p>
        </Accordion>
      </div>

      {/* Fixed footer */}
      <div className="shrink-0 border-t border-border-default p-3 space-y-1.5 bg-bg-surface-1">
        <Button size="sm" variant="secondary" className="w-full" onClick={() => exportSingle(activeSlideIndex)} loading={exporting}>
          <Download size={13} className="mr-1.5" /> Baixar Slide {activeSlideIndex + 1}
        </Button>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" className="w-full">
            <Save size={13} className="mr-1" /> Salvar
          </Button>
          <Button size="sm" variant="secondary" className="w-full" onClick={exportAll} loading={exporting}>
            <Download size={13} className="mr-1" /> Baixar Todos
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant="ghost" className="w-full" onClick={() => setCaptionModal(true)}>
            <Sparkles size={13} className="mr-1" /> Legenda
          </Button>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setPublishModal(true)}>
            <Rocket size={13} className="mr-1" /> Publicar
          </Button>
        </div>
      </div>

      <PublishModal open={publishModal} onClose={() => setPublishModal(false)} />
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix = "" }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-text-secondary whitespace-nowrap w-16 shrink-0">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 h-1 accent-white" />
      <span className="text-[10px] text-text-secondary w-10 text-right shrink-0">{value}{suffix}</span>
    </div>
  );
}
