"use client";

import { Button } from "@/components/ui/button";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SelectTestimonialDialog from "./select-testimonial-dialog";
import TestimonialCardDraggable from "./testimonial-layout-draggable";

export default function TestimonialsContent() {
  const [openSelectTestimonialdialog, setOpenSelectTestimonialdialog] =
    useState(false);

  const [items, setItems] = useState(
    Array.from({ length: 10 }).map((_, index) => index + 1),
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (active.id !== over.id)
      setItems((items) => {
        const oldIndex = items.indexOf(Number(active.id));
        const newIndex = items.indexOf(Number(over.id));

        return arrayMove(items, oldIndex, newIndex);
      });
  };

  return (
    <>
      <div className="text-muted-foreground space-y-2 text-center text-sm">
        <p>Showing 6 testimonials on this wall</p>
        <p>
          <Button
            variant="outline"
            onClick={() => setOpenSelectTestimonialdialog(true)}
          >
            Choose testimonials
          </Button>{" "}
          to update the selections
        </p>
      </div>
      <div className="bg-muted mt-5 overflow-hidden rounded-lg p-2">
        <p className="text-muted-foreground mb-2 text-sm italic">
          Drag and drop the testimonials below to reorder how they appear on the
          embed wall.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((id) => (
                <TestimonialCardDraggable key={id} id={id} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <SelectTestimonialDialog
        open={openSelectTestimonialdialog}
        handleOpenChange={(open) => setOpenSelectTestimonialdialog(open)}
      />
    </>
  );
}
