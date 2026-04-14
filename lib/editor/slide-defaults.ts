import type { Slide } from "./editor-types";

let idCounter = 0;

export function generateId(): string {
  return `slide-${Date.now()}-${++idCounter}`;
}

export function createDefaultSlide(order: number): Slide {
  return {
    id: generateId(),
    order,
    darkMode: true,
    background: {
      type: "solid",
      color: "#0a0a0a",
      posX: 50,
      posY: 50,
      zoom: 100,
    },
    overlay: {
      type: "none",
      opacity: 50,
    },
    pattern: {
      type: "none",
    },
    title: {
      text: order === 0 ? "Titulo do Hook" : `Slide ${order + 1}`,
      fontSize: 48,
      fontFamily: "Inter",
      fontWeight: 700,
      color: "#ffffff",
      letterSpacing: 0,
    },
    subtitle: {
      text: "",
      fontSize: 20,
      fontFamily: "Inter",
      fontWeight: 400,
      color: "#a1a1a6",
      lineHeight: 1.5,
    },
    layout: {
      position: "center",
      alignment: "center",
      marginH: 40,
      marginV: 40,
      glass: false,
      scale: 100,
    },
    highlights: [],
    badge: {
      show: false,
      showAll: false,
      showLogo: false,
      corners: {
        topLeft: { text: "@handle", show: false },
        topRight: { text: "Categoria", show: false },
        bottomLeft: { text: "", show: false },
        bottomRight: { text: "", show: false },
      },
      fontSize: 12,
      borderDistance: 20,
      opacity: 100,
      glass: false,
      minimalBorder: false,
      indicators: false,
      ctaIcon: "none",
    },
    cta: { show: false, text: "Arraste para o lado" },
  };
}

export const EDITOR_FONTS = [
  "Inter",
  "Playfair Display",
  "Caveat",
  "Space Grotesk",
  "Syne",
  "Outfit",
  "DM Sans",
  "Raleway",
  "Bebas Neue",
  "Montserrat",
  "Plus Jakarta Sans",
  "Manrope",
  "Urbanist",
] as const;

export const HIGHLIGHT_COLORS = [
  { name: "Amarelo", value: "#facc15" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#22c55e" },
  { name: "Laranja", value: "#f97316" },
  { name: "Roxo", value: "#a855f7" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ciano", value: "#06b6d4" },
] as const;

export const OVERLAY_TYPES = [
  { value: "none", label: "Nenhum" },
  { value: "gradient", label: "Gradiente" },
  { value: "vignette", label: "Vinheta" },
  { value: "base", label: "Base" },
  { value: "top", label: "Topo" },
  { value: "frame", label: "Moldura" },
  { value: "diagonal", label: "Diagonal" },
] as const;

export const PATTERN_TYPES = [
  { value: "none", label: "Nenhum" },
  { value: "grid", label: "Grade" },
  { value: "dots", label: "Bolinhas" },
  { value: "lines-h", label: "Linhas Horizontais" },
  { value: "lines-d", label: "Linhas Diagonais" },
  { value: "checker", label: "Xadrez" },
] as const;

export const CTA_ICONS = [
  { value: "none", label: "Nenhum" },
  { value: "save", label: "Salvar" },
  { value: "swipe", label: "Arrastar" },
  { value: "like", label: "Curtir" },
  { value: "share", label: "Compartilhar" },
  { value: "comment", label: "Comentar" },
  { value: "click", label: "Clicar" },
] as const;
