import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { EmbedWall, Response } from "@/prisma/src/generated/prisma/client";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { borderRadiusMap } from "../_lib/constants";

interface TestimonialCardProps {
  className?: string;
  response: Response;
  embedWall: EmbedWall;
}

export default function TestimonialCard({
  className,
  response,
  embedWall,
}: TestimonialCardProps) {
  const {
    show_date,
    show_title,
    show_company,
    show_star_rating,

    card_bg_color,
    text_primary_color,
    text_secondary_color,
    border_radius,
    border_thickness,
    border_color,
  } = embedWall;

  const { answers: rawAnswers, submitted_at } = response;
  const answers = rawAnswers as Record<string, string>;

  const formatTitleAndCompany = [
    show_title && answers.title,
    show_company && answers.company,
  ]
    .filter(Boolean)
    .join(", ");

  const textRef = useRef<HTMLInputElement>(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [isTextClamped, setIsTextClamped] = useState(true);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    setIsTextOverflowing(textEl.offsetHeight < textEl.scrollHeight);
  }, []);

  return (
    <div
      className={cn("w-full p-4", className)}
      style={{
        backgroundColor: card_bg_color,
        color: text_primary_color,
        borderWidth: border_thickness,
        borderRadius: borderRadiusMap[border_radius],
        borderColor: border_color,
      }}
    >
      <div>
        <span className="block font-bold">{answers.name}</span>
        {formatTitleAndCompany && (
          <span
            className="block text-sm"
            style={{ color: text_secondary_color }}
          >
            {formatTitleAndCompany}
          </span>
        )}
      </div>

      {show_star_rating && answers.rating && (
        <Rating value={Number(answers.rating)} readOnly className="mt-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton className="text-yellow-500" key={index} />
          ))}
        </Rating>
      )}
      <p
        ref={textRef}
        className={cn("text-sm", { "line-clamp-5": isTextClamped })}
      >
        {answers.testimonial}
      </p>
      {isTextOverflowing && (
        <button
          className="cursor-pointer text-sm underline transition-all hover:opacity-80"
          onClick={() => setIsTextClamped((prev) => !prev)}
        >
          {isTextClamped ? "Show more" : "Show less"}
        </button>
      )}

      {show_date && (
        <span
          className="mt-3 block text-xs"
          style={{ color: text_secondary_color }}
        >
          {format(new Date(submitted_at), "MMM d, yyyy")}
        </span>
      )}
    </div>
  );
}
