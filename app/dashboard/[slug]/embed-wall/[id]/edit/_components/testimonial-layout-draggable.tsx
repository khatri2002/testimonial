import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TestimonialCardDraggableProps {
  id: number;
}

export default function TestimonialCardDraggable({
  id,
}: TestimonialCardDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-card text-foreground cursor-grab rounded-lg border p-4 transition-colors active:cursor-grabbing"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="block font-bold">Jay K</span>
      <Rating value={4} readOnly className="pointer-events-none mt-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton className="text-yellow-500" key={index} />
        ))}
      </Rating>
      <p className="text-sm">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex iste
        deleniti sequi voluptate accusamus et, adipisci tempore error similique
        vitae!
      </p>
    </div>
  );
}
