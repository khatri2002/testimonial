"use client";

import { Prisma } from "@/prisma/src/generated/prisma/client";
import Masonry from "react-responsive-masonry";
import TestimonialCard from "./testimonial-card";

interface TestimonialCardsProps {
  embedWall: Prisma.EmbedWallGetPayload<{ include: { responses: true } }>;
}

export default function TestimonialCards({ embedWall }: TestimonialCardsProps) {
  const { card_gap, page_bg_color, responses } = embedWall;

  const hasFewCards = responses.length <= 3;
  const gap = `${card_gap}px`;

  const cards = responses.map((response) => (
    <TestimonialCard
      key={response.id}
      className={hasFewCards ? "w-1/3" : undefined}
      response={response}
      embedWall={embedWall}
    />
  ));

  return (
    <div className="min-h-screen" style={{ backgroundColor: page_bg_color }}>
      {hasFewCards ? (
        <div className="flex items-start justify-center" style={{ gap }}>
          {cards}
        </div>
      ) : (
        <Masonry columnsCount={3} gutter={gap}>
          {cards}
        </Masonry>
      )}
    </div>
  );
}
