import { Checkbox } from "@/components/ui/checkbox";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { ResponseWithInclusion } from "../_lib/types";
import { useEmbedWallStore } from "../_lib/useEmbedWallStore";

interface TestimonialSelectCardProps {
  response: ResponseWithInclusion;
}

export default function TestimonialCardSelectable({
  response,
}: TestimonialSelectCardProps) {
  const toggleResponseInclusion = useEmbedWallStore(
    (state) => state.toggleResponseInclusion,
  );

  const { id, answers: rawAnswers, isIncluded } = response;
  const answers = rawAnswers as Record<string, string | number | boolean>;

  return (
    <div
      className={cn(
        "bg-card text-foreground hover:bg-theme-primary/11 relative cursor-pointer rounded-lg border p-4 transition-colors",
        {
          "bg-theme-primary/25 border-theme-primary hover:bg-theme-primary/25":
            isIncluded,
        },
      )}
      onClick={() => toggleResponseInclusion(id)}
    >
      <Checkbox
        className="data-[state=checked]:bg-theme-primary! bg-card! absolute -top-1 -left-1 size-5 cursor-pointer"
        checked={isIncluded}
      />
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
      <p className="text-sm whitespace-pre-line">{answers.testimonial}</p>
    </div>
  );
}
