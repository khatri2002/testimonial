import { Checkbox } from "@/components/ui/checkbox";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";

interface TestimonialSelectCardProps {
  selected: boolean;
}

export default function TestimonialCardSelectable({
  selected,
}: TestimonialSelectCardProps) {
  return (
    <div
      className={cn(
        "bg-card text-foreground hover:bg-theme-primary/11 relative cursor-pointer rounded-lg border p-4 transition-colors",
        {
          "bg-theme-primary/25 border-theme-primary hover:bg-theme-primary/25":
            selected,
        },
      )}
    >
      <Checkbox
        className="data-[state=checked]:bg-theme-primary! bg-card! absolute -top-1 -left-1 size-5 cursor-pointer"
        checked={selected}
      />
      <span className="block font-bold">Jay K</span>
      <Rating value={4} readOnly className="mt-3">
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
