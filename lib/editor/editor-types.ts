export type SlideFormat = "carousel" | "square" | "stories";

export const SLIDE_DIMENSIONS: Record<SlideFormat, { width: number; height: number }> = {
  carousel: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
  stories: { width: 1080, height: 1920 },
};

export interface SlideHighlight {
  word: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export interface SlideBadge {
  show: boolean;
  showAll: boolean;
  showLogo: boolean;
  logoUrl?: string;
  corners: {
    topLeft: { text: string; show: boolean };
    topRight: { text: string; show: boolean };
    bottomLeft: { text: string; show: boolean };
    bottomRight: { text: string; show: boolean };
  };
  fontSize: number;
  borderDistance: number;
  opacity: number;
  glass: boolean;
  minimalBorder: boolean;
  indicators: boolean;
  ctaIcon: string;
}

export interface Slide {
  id: string;
  order: number;
  darkMode: boolean;
  background: {
    type: "solid" | "image";
    color: string;
    imageUrl?: string;
    posX: number;
    posY: number;
    zoom: number;
  };
  overlay: {
    type: "none" | "gradient" | "vignette" | "base" | "top" | "frame" | "diagonal";
    opacity: number;
  };
  pattern: {
    type: "none" | "grid" | "dots" | "lines-h" | "lines-d" | "checker";
  };
  title: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
    color: string;
    letterSpacing: number;
  };
  subtitle: {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
    color: string;
    lineHeight: number;
  };
  layout: {
    position: string;
    alignment: "left" | "center" | "right";
    marginH: number;
    marginV: number;
    glass: boolean;
    scale: number;
  };
  highlights: SlideHighlight[];
  badge: SlideBadge;
  cta: { show: boolean; text: string };
}

export interface EditorState {
  carouselId: string | null;
  title: string;
  format: SlideFormat;
  slides: Slide[];
  activeSlideIndex: number;
  history: {
    past: Slide[][];
    future: Slide[][];
  };
  isDirty: boolean;
}
