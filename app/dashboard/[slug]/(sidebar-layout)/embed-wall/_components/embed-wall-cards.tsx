import { EmbedWall } from "@/prisma/src/generated/prisma/client";
import { Grid2x2X } from "lucide-react";
import EmbedWallCard from "./embed-wall-card";

interface EmbedWallCardsProps {
  embedWalls: EmbedWall[];
}

export default function EmbedWallCards({ embedWalls }: EmbedWallCardsProps) {
  return embedWalls.length === 0 ? (
    <div className="text-muted-foreground flex flex-col items-center gap-4 p-10">
      <Grid2x2X className="size-11" />
      <p>There are no walls matching your current search</p>
    </div>
  ) : (
    <div className="mt-4 space-y-3">
      {embedWalls.map((embedWall) => (
        <EmbedWallCard key={embedWall.id} embedWall={embedWall} />
      ))}
    </div>
  );
}
