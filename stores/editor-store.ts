import { create } from "zustand";
import type { EditorState, Slide, SlideFormat } from "@/lib/editor/editor-types";
import { createDefaultSlide } from "@/lib/editor/slide-defaults";

interface EditorActions {
  // Initialization
  initEditor: (carouselId: string | null, title: string, slides?: Slide[]) => void;
  reset: () => void;

  // Slides
  setActiveSlide: (index: number) => void;
  addSlide: () => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  updateSlide: (index: number, updates: Partial<Slide>) => void;
  updateSlideDeep: <K extends keyof Slide>(
    index: number,
    key: K,
    updates: Partial<Slide[K]>
  ) => void;

  // Format
  setFormat: (format: SlideFormat) => void;
  setTitle: (title: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Dirty state
  markClean: () => void;
}

type EditorStore = EditorState & EditorActions;

const MAX_SLIDES = 20;

export const useEditorStore = create<EditorStore>((set, get) => ({
  // State
  carouselId: null,
  title: "Sem titulo",
  format: "carousel",
  slides: [createDefaultSlide(0)],
  activeSlideIndex: 0,
  history: { past: [], future: [] },
  isDirty: false,

  // Actions
  initEditor: (carouselId, title, slides) => {
    set({
      carouselId,
      title,
      slides: slides && slides.length > 0 ? slides : [createDefaultSlide(0)],
      activeSlideIndex: 0,
      history: { past: [], future: [] },
      isDirty: false,
    });
  },

  reset: () => {
    set({
      carouselId: null,
      title: "Sem titulo",
      format: "carousel",
      slides: [createDefaultSlide(0)],
      activeSlideIndex: 0,
      history: { past: [], future: [] },
      isDirty: false,
    });
  },

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  addSlide: () => {
    const { slides } = get();
    if (slides.length >= MAX_SLIDES) return;
    get().pushHistory();
    const newSlide = createDefaultSlide(slides.length);
    set({
      slides: [...slides, newSlide],
      activeSlideIndex: slides.length,
      isDirty: true,
    });
  },

  duplicateSlide: (index) => {
    const { slides } = get();
    if (slides.length >= MAX_SLIDES) return;
    get().pushHistory();
    const clone: Slide = {
      ...JSON.parse(JSON.stringify(slides[index])),
      id: `slide-${Date.now()}-dup`,
      order: slides.length,
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, clone);
    newSlides.forEach((s, i) => (s.order = i));
    set({ slides: newSlides, activeSlideIndex: index + 1, isDirty: true });
  },

  deleteSlide: (index) => {
    const { slides, activeSlideIndex } = get();
    if (slides.length <= 1) return;
    get().pushHistory();
    const newSlides = slides.filter((_, i) => i !== index);
    newSlides.forEach((s, i) => (s.order = i));
    const newActive = activeSlideIndex >= newSlides.length
      ? newSlides.length - 1
      : activeSlideIndex > index
        ? activeSlideIndex - 1
        : activeSlideIndex;
    set({ slides: newSlides, activeSlideIndex: newActive, isDirty: true });
  },

  reorderSlides: (fromIndex, toIndex) => {
    get().pushHistory();
    const { slides } = get();
    const newSlides = [...slides];
    const [moved] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, moved);
    newSlides.forEach((s, i) => (s.order = i));
    set({ slides: newSlides, activeSlideIndex: toIndex, isDirty: true });
  },

  updateSlide: (index, updates) => {
    const { slides } = get();
    const newSlides = slides.map((s, i) =>
      i === index ? { ...s, ...updates } : s
    );
    set({ slides: newSlides, isDirty: true });
  },

  updateSlideDeep: (index, key, updates) => {
    const { slides } = get();
    const slide = slides[index];
    const current = slide[key];
    const newSlides = slides.map((s, i) =>
      i === index
        ? { ...s, [key]: { ...(current as object), ...(updates as object) } }
        : s
    );
    set({ slides: newSlides, isDirty: true });
  },

  setFormat: (format) => set({ format, isDirty: true }),
  setTitle: (title) => set({ title, isDirty: true }),

  undo: () => {
    const { history, slides } = get();
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    set({
      slides: previous,
      history: {
        past: history.past.slice(0, -1),
        future: [slides, ...history.future],
      },
      isDirty: true,
    });
  },

  redo: () => {
    const { history, slides } = get();
    if (history.future.length === 0) return;
    const next = history.future[0];
    set({
      slides: next,
      history: {
        past: [...history.past, slides],
        future: history.future.slice(1),
      },
      isDirty: true,
    });
  },

  pushHistory: () => {
    const { slides, history } = get();
    set({
      history: {
        past: [...history.past.slice(-30), JSON.parse(JSON.stringify(slides))],
        future: [],
      },
    });
  },

  markClean: () => set({ isDirty: false }),
}));
