"use client";

import { Prisma } from "@/prisma/src/generated/prisma/client";
import Fuse from "fuse.js";
import { Grid2x2X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useSearchStore } from "../lib/useSearchStore";
import SpaceCard from "./space-card";

interface SpaceCardsProps {
  spaces: Prisma.SpaceGetPayload<{
    include: { _count: { select: { responses: true } } };
  }>[];
}

export default function SpaceCards({ spaces }: SpaceCardsProps) {
  const query = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(query, 700);

  const fuse = new Fuse(spaces, {
    keys: ["name", "slug", "header_title", "message"],
    threshold: 0.3,
  });

  const filteredSpaces = debouncedQuery
    ? fuse.search(debouncedQuery).map((result) => result.item)
    : spaces;

  return filteredSpaces.length > 0 ? (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
      {filteredSpaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  ) : (
    <div className="text-muted-foreground flex flex-col items-center gap-4 p-10">
      <Grid2x2X className="size-11" />
      <p>There are no spaces matching your current search</p>
    </div>
  );
}
