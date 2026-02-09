import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEmbedWallStore } from "../_lib/useEmbedWallStore";

interface TestimonialCardSortableProps {
  id: string;
  className?: string;
}

export default function TestimonialCardSortable({
  id,
  className,
}: TestimonialCardSortableProps) {
  const responsesById = useEmbedWallStore((state) => state.responsesById);
  const { answers: rawAnswers } = responsesById[id];
  const answers = rawAnswers as Record<string, string | number | boolean>;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        "bg-card text-foreground h-56 cursor-grab rounded-lg border p-4",
        { "opacity-0": isDragging },
        className,
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="block font-bold">{answers.name}</span>
      {answers.rating && (
        <Rating
          value={Number(answers.rating)}
          readOnly
          className="pointer-events-none mt-3"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton className="text-yellow-500" key={index} />
          ))}
        </Rating>
      )}
      <p className="line-clamp-5 text-sm whitespace-pre-line">
        {answers.testimonial}
      </p>
    </div>
  );
}
