"use client";

import { Prisma } from "@/prisma/src/generated/prisma/client";
import Masonry from "react-responsive-masonry";
import TestimonialCard from "./testimonial-card";

interface TestimonialCardsProps {
  embedWall: Prisma.EmbedWallGetPayload<{
    include: { embedWallResponses: { include: { response: true } } };
  }>;
}

export default function TestimonialCards({ embedWall }: TestimonialCardsProps) {
  const { card_gap, page_bg_color, embedWallResponses } = embedWall;

  const hasFewCards = embedWallResponses.length <= 3;
  const gap = `${card_gap}px`;

  // sort by 'order' in ascending order
  embedWallResponses.sort((a, b) => a.order - b.order);

  const cards = embedWallResponses.map((embedWallResponse) => (
    <TestimonialCard
      key={embedWallResponse.id}
      className={hasFewCards ? "w-1/3" : undefined}
      response={embedWallResponse.response}
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
