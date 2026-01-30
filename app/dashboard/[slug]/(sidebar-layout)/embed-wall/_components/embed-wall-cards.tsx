"use client";

import { EmbedWall } from "@/prisma/src/generated/prisma/client";
import Fuse from "fuse.js";
import { Grid2x2X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useSearchStore } from "../_lib/useSearchStore";
import EmbedWallCard from "./embed-wall-card";

interface EmbedWallCardsProps {
  embedWalls: EmbedWall[];
  slug: string;
}

export default function EmbedWallCards({
  embedWalls,
  slug,
}: EmbedWallCardsProps) {
  const query = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(query, 700);

  const fuse = new Fuse(embedWalls, {
    keys: ["name"],
    threshold: 0.3,
  });

  const filteredEmbedWalls = debouncedQuery
    ? fuse.search(debouncedQuery).map((result) => result.item)
    : embedWalls;

  return filteredEmbedWalls.length === 0 ? (
    <div className="text-muted-foreground flex flex-col items-center gap-4 p-10">
      <Grid2x2X className="size-11" />
      <p>There are no walls matching your current search</p>
    </div>
  ) : (
    <div className="mt-4 space-y-3">
      {filteredEmbedWalls.map((embedWall) => (
        <EmbedWallCard key={embedWall.id} embedWall={embedWall} slug={slug} />
      ))}
    </div>
  );
}
