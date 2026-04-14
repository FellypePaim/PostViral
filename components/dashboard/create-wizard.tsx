"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, Upload, Loader2 } from "lucide-react";
import { createCarousel } from "@/lib/local-storage-db";
import { EDITOR_FONTS } from "@/lib/editor/slide-defaults";
import type { SlideFormat } from "@/lib/editor/editor-types";

interface CreateWizardProps {
  open: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

const FORMAT_OPTIONS: { value: SlideFormat; label: string; desc: string }[] = [
  { value: "carousel", label: "Carrossel", desc: "4:5 - 1080x1350" },
  { value: "square", label: "Quadrado", desc: "1:1 - 1080x1080" },
  { value: "stories", label: "Stories", desc: "9:16 - 1080x1920" },
];

const STYLE_OPTIONS = [
  { value: "minimalista", label: "Minimalista", desc: "Texto em destaque, overlays cinematograficos, tipografia bold" },
  { value: "profile", label: "Profile (Twitter)", desc: "Estetica de screenshot de tweet. Limpo, focado em texto" },
];

const IMAGE_OPTIONS = [
  { value: "none", label: "Sem imagens" },
  { value: "background", label: "So imagem de fundo" },
  { value: "grid", label: "So grade de imagens" },
  { value: "both", label: "Intercalar ambas" },
];

const FONT_COMBOS = [
  "Space Grotesk + Inter",
  "Syne + DM Sans",
  "Bebas Neue + Raleway",
  "Playfair Display + Inter",
  "Montserrat + Outfit",
  "Manrope + Urbanist",
];

export function CreateWizard({ open, onClose }: CreateWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [generating, setGenerating] = useState(false);

  // Step 1
  const [format, setFormat] = useState<SlideFormat>("carousel");
  const [style, setStyle] = useState("minimalista");

  // Step 2
  const [mode, setMode] = useState<"ai" | "manual" | null>(null);

  // Step 3
  const [topic, setTopic] = useState("");
  const [keepExact, setKeepExact] = useState(false);
  const [slideCount, setSlideCount] = useState(5);
  const [imageMode, setImageMode] = useState("none");

  // Step 4
  const [instagram, setInstagram] = useState("");
  const [fontCombo, setFontCombo] = useState(FONT_COMBOS[0]);
  const [bgColor, setBgColor] = useState("#0a0a0a");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [subtitleColor, setSubtitleColor] = useState("#a1a1a6");

  function handleClose() {
    setStep(1);
    setMode(null);
    setTopic("");
    onClose();
  }

  function handleManual() {
    const carousel = createCarousel({
      title: "Novo carrossel",
      post_style: style,
      slide_count: 1,
    });
    handleClose();
    router.push(`/gerador?id=${carousel.id as string}`);
  }

  async function handleGenerate() {
    setGenerating(true);

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2500));

    const slides = Array.from({ length: slideCount }, (_, i) => ({
      id: `slide-${Date.now()}-${i}`,
      order: i,
      darkMode: true,
      background: { type: "solid" as const, color: bgColor, posX: 50, posY: 50, zoom: 100 },
      overlay: { type: "none" as const, opacity: 50 },
      pattern: { type: "none" as const },
      title: {
        text: i === 0 ? topic.slice(0, 60) || "Hook do carrossel" : `Ponto ${i}`,
        fontSize: 48,
        fontFamily: fontCombo.split(" + ")[0],
        fontWeight: 700,
        color: titleColor,
        letterSpacing: 0,
      },
      subtitle: {
        text: i === 0 ? "Arraste para ver mais" : "",
        fontSize: 20,
        fontFamily: fontCombo.split(" + ")[1] || "Inter",
        fontWeight: 400,
        color: subtitleColor,
        lineHeight: 1.5,
      },
      layout: { position: "center", alignment: "center" as const, marginH: 40, marginV: 40, glass: false, scale: 100 },
      highlights: [],
      badge: {
        show: !!instagram,
        showAll: true,
        showLogo: false,
        corners: {
          topLeft: { text: instagram || "@perfil", show: !!instagram },
          topRight: { text: "", show: false },
          bottomLeft: { text: "", show: false },
          bottomRight: { text: "", show: false },
        },
        fontSize: 12, borderDistance: 20, opacity: 100, glass: false, minimalBorder: false, indicators: false, ctaIcon: "none",
      },
      cta: { show: i === slideCount - 1, text: "Salve e compartilhe" },
    }));

    const carousel = createCarousel({
      title: topic || "Carrossel com IA",
      topic,
      post_style: style,
      slide_count: slideCount,
      slides_data: { slides, format },
    });

    setGenerating(false);
    handleClose();
    router.push(`/gerador?id=${carousel.id as string}`);
  }

  if (generating) {
    return (
      <Modal open={open} onClose={() => {}}>
        <div className="text-center py-12">
          <Loader2 size={40} className="animate-spin text-text-secondary mx-auto" />
          <h3 className="text-lg font-semibold mt-4">Analisando seu conteudo...</h3>
          <p className="text-sm text-text-secondary mt-1">Gerando conteudo com IA</p>
          <div className="w-full bg-bg-surface-3 rounded-full h-1.5 mt-6">
            <div className="bg-accent-bg h-1.5 rounded-full animate-pulse" style={{ width: "70%" }} />
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-xl">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              s <= step ? "bg-accent-bg" : "bg-bg-surface-3"
            } ${s <= (mode === "manual" ? 2 : 4) ? "" : "opacity-30"}`}
          />
        ))}
      </div>

      {/* Step 1: Formato e Estilo */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-bold">Formato e Estilo</h2>
            <p className="text-sm text-text-secondary mt-1">Escolha o formato do post e o estilo visual</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Formato do post</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`p-3 rounded-lg border text-center text-sm cursor-pointer transition-colors ${
                    format === f.value
                      ? "border-accent-bg bg-accent-bg/5 text-text-primary"
                      : "border-border-default text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  <span className="font-medium block">{f.label}</span>
                  <span className="text-xs opacity-70">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Estilo visual</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-4 rounded-lg border text-left cursor-pointer transition-colors ${
                    style === s.value
                      ? "border-accent-bg bg-accent-bg/5"
                      : "border-border-default hover:border-text-secondary"
                  }`}
                >
                  <span className="font-medium text-sm block text-text-primary">{s.label}</span>
                  <span className="text-xs text-text-secondary mt-1 block">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full">
            Continuar →
          </Button>
        </div>
      )}

      {/* Step 2: Modo */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-bold">Como deseja comecar?</h2>
            <p className="text-sm text-text-secondary mt-1">Deixe a IA fazer o trabalho pesado ou comece do zero</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setMode("ai"); setStep(3); }}
              className="p-6 rounded-xl border border-border-default hover:border-accent-bg text-center cursor-pointer transition-all hover:bg-accent-bg/5 group"
            >
              <Sparkles size={28} className="mx-auto text-text-secondary group-hover:text-accent-bg" />
              <span className="font-semibold block mt-3">Usar IA</span>
              <span className="text-xs text-text-secondary mt-1 block">De um topico e criamos slides com conteudo, layout e imagens</span>
            </button>
            <button
              onClick={handleManual}
              className="p-6 rounded-xl border border-border-default hover:border-text-secondary text-center cursor-pointer transition-all hover:bg-bg-surface-2 group"
            >
              <PenTool size={28} className="mx-auto text-text-secondary group-hover:text-text-primary" />
              <span className="font-semibold block mt-3">Criacao Manual</span>
              <span className="text-xs text-text-secondary mt-1 block">Comece do zero, adicione slides e escreva textos</span>
            </button>
          </div>

          <button onClick={() => setStep(1)} className="text-sm text-text-secondary hover:text-text-primary cursor-pointer">
            ← Voltar
          </button>
        </div>
      )}

      {/* Step 3: Configurar IA */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold">Configurar IA</h2>
            <p className="text-sm text-text-secondary mt-1">Diga sobre o que e o conteudo e como quer o carrossel</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Sobre o que e o conteudo?</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: 5 prompts ultra realistas para foto de perfil com IA..."
              className="w-full mt-1 bg-bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary resize-none h-20"
            />
            <label className="flex items-center gap-2 mt-2 text-xs text-text-secondary cursor-pointer">
              <input type="checkbox" checked={keepExact} onChange={(e) => setKeepExact(e.target.checked)} className="rounded accent-white" />
              Manter conteudo exato (a IA distribui sem reescrever)
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Imagens de referencia (opcional)</label>
            <div className="flex gap-2 mt-1">
              <button className="flex-1 py-2 text-xs text-center border border-dashed border-border-default rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary cursor-pointer">
                <Upload size={14} className="inline mr-1" /> Upload
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Numero de slides</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setSlideCount(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    slideCount === n
                      ? "bg-accent-bg text-accent-text"
                      : "bg-bg-surface-3 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Imagens no carrossel</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {IMAGE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setImageMode(o.value)}
                  className={`py-2 text-xs rounded-lg border cursor-pointer ${
                    imageMode === o.value
                      ? "border-accent-bg bg-accent-bg/5 text-text-primary"
                      : "border-border-default text-text-secondary"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="text-sm text-text-secondary hover:text-text-primary cursor-pointer">
              ← Voltar
            </button>
            <Button onClick={() => setStep(4)} className="flex-1" disabled={!topic.trim()}>
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Personalizar */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold">Personalizar</h2>
            <p className="text-sm text-text-secondary mt-1">Identidade visual do seu carrossel</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">@ do Instagram (opcional)</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seuperfil"
              className="w-full mt-1 bg-bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Combinacao de fontes</label>
            <select
              value={fontCombo}
              onChange={(e) => setFontCombo(e.target.value)}
              className="w-full mt-1 bg-bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary"
            >
              {FONT_COMBOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase">Identidade visual</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <label className="text-xs text-text-secondary">Fundo</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded border border-border-default cursor-pointer" />
                  <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 bg-bg-surface-3 border border-border-default rounded px-2 py-1 text-xs text-text-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary">Titulo</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-8 h-8 rounded border border-border-default cursor-pointer" />
                  <input type="text" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="flex-1 bg-bg-surface-3 border border-border-default rounded px-2 py-1 text-xs text-text-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary">Subtitulo</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input type="color" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="w-8 h-8 rounded border border-border-default cursor-pointer" />
                  <input type="text" value={subtitleColor} onChange={(e) => setSubtitleColor(e.target.value)} className="flex-1 bg-bg-surface-3 border border-border-default rounded px-2 py-1 text-xs text-text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(3)} className="text-sm text-text-secondary hover:text-text-primary cursor-pointer">
              ← Voltar
            </button>
            <Button onClick={handleGenerate} className="flex-1">
              <Sparkles size={15} className="mr-1.5" />
              Gerar carrossel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
