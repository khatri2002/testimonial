"use client";

import { updateEmbedWallResponses } from "@/actions/embed-wall";
import { Button } from "@/components/ui/button";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { toast } from "sonner";
import { useEmbedWallStore } from "../_lib/useEmbedWallStore";
import SelectTestimonialDialog from "./select-testimonial-dialog";
import TestimonialCardSortable from "./testimonial-layout-sortable";

export default function TestimonialsContent() {
  const id = useEmbedWallStore((state) => state.id);
  const includedIds = useEmbedWallStore((state) => state.includedIds);
  const setIncludedIds = useEmbedWallStore((state) => state.setIncludedIds);

  const [openSelectTestimonialdialog, setOpenSelectTestimonialdialog] =
    useState(false);

  const handleUpdateEmbedWallResponses = async () => {
    if (!id) return;

    const { success } = await updateEmbedWallResponses(id, includedIds);
    if (!success) toast.error("Couldn't save");
  };

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(String(active.id));
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    if (active.id !== over.id) {
      const oldIndex = includedIds.indexOf(String(active.id));
      const newIndex = includedIds.indexOf(String(over.id));
      const updatedIncludedIds = arrayMove(includedIds, oldIndex, newIndex);

      setIncludedIds(updatedIncludedIds);
      handleUpdateEmbedWallResponses();
    }

    setActiveId(null);
  };

  return (
    <>
      <div className="text-muted-foreground space-y-2 text-center text-sm">
        <p>Showing {includedIds.length} testimonials on this wall</p>
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={includedIds} strategy={rectSortingStrategy}>
              {includedIds.map((id) => (
                <TestimonialCardSortable key={id} id={id} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId && (
                <TestimonialCardSortable
                  id={activeId}
                  className="cursor-grabbing"
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      <SelectTestimonialDialog
        open={openSelectTestimonialdialog}
        handleOpenChange={(open) => {
          setOpenSelectTestimonialdialog(open);
          handleUpdateEmbedWallResponses();
        }}
      />
    </>
  );
}
