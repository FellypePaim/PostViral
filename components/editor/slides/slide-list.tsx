"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/stores/editor-store";
import { Plus } from "lucide-react";

function SortableSlide({ id, index }: { id: string; index: number }) {
  const { activeSlideIndex, setActiveSlide, slides } = useEditorStore();
  const slide = slides[index];
  const isActive = index === activeSlideIndex;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setActiveSlide(index)}
      className={`relative w-full aspect-[4/5] rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
        isActive
          ? "border-accent-bg"
          : "border-transparent hover:border-border-default"
      }`}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: slide.background.color }}
      >
        {slide.background.type === "image" && slide.background.imageUrl ? (
          <img
            src={slide.background.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[8px] text-white/60 text-center px-1 leading-tight line-clamp-3">
            {slide.title.text || `Slide ${index + 1}`}
          </span>
        )}
      </div>
      <div className="absolute bottom-0.5 right-1 text-[8px] text-white/40 bg-black/40 px-1 rounded">
        {index + 1}
      </div>
    </div>
  );
}

export function SlideList() {
  const { slides, addSlide, reorderSlides } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    reorderSlides(oldIndex, newIndex);
  }

  return (
    <div className="w-20 shrink-0 flex flex-col gap-2 overflow-y-auto py-2 px-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={slides.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {slides.map((slide, i) => (
            <SortableSlide key={slide.id} id={slide.id} index={i} />
          ))}
        </SortableContext>
      </DndContext>

      {slides.length < 20 && (
        <button
          onClick={addSlide}
          className="w-full aspect-[4/5] rounded-lg border border-dashed border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors cursor-pointer"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
