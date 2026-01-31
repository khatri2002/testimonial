"use client";

import { Prisma } from "@/prisma/src/generated/prisma/client";
import { useEffect, useRef } from "react";
import Masonry from "react-responsive-masonry";
import TestimonialCard from "./testimonial-card";

interface TestimonialCardsProps {
  embedWall: Prisma.EmbedWallGetPayload<{
    include: { embedWallResponses: { include: { response: true } } };
  }>;
  className?: string;
}

export default function TestimonialCards({
  embedWall,
  className,
}: TestimonialCardsProps) {
  const { card_gap, page_bg_color, embedWallResponses } = embedWall;

  const hasFewCards = embedWallResponses.length <= 3;
  const gap = `${card_gap}px`;

  const cards = embedWallResponses.map((embedWallResponse) => (
    <TestimonialCard
      key={embedWallResponse.id}
      className={hasFewCards ? "w-1/3" : undefined}
      response={embedWallResponse.response}
      embedWall={embedWall}
    />
  ));

  const containerRef = useRef<HTMLDivElement>(null);

  // send height to parent for iframe resizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const sendHeightToParent = () => {
      const height = el.offsetHeight;
      window.parent.postMessage({ type: "setHeight", value: height }, "*");
    };
    const observer = new ResizeObserver(() => {
      sendHeightToParent();
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} style={{ backgroundColor: page_bg_color }}>
      <div ref={containerRef} className="p-5">
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
    </div>
  );
}
