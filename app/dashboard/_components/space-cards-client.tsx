"use client";

import { Prisma } from "@/prisma/app/generated/prisma/client";
import { default as Fuse } from "fuse.js";
import { useMemo } from "react";
import { useSearchStore } from "../lib/useSearchStore";
import { SpaceCard } from "./space-card";

interface SpaceCardsClientProps {
  spaces: Array<
    Prisma.SpaceGetPayload<{
      include: {
        _count: { select: { responses: true } };
      };
    }>
  >;
}

export default function SpaceCardsClient({ spaces }: SpaceCardsClientProps) {
  const query = useSearchStore((state) => state.query);

  const filteredSpaces = useMemo(() => {
    const fuse = new Fuse(spaces, { keys: ["name"], threshold: 0.3 });
    if (!query.trim()) return spaces;
    return fuse.search(query).map((r) => r.item);
  }, [query, spaces]);

  return filteredSpaces.length === 0 ? (
    <div className="fixed top-1/2 left-1/2 -translate-1/2">
      <span className="text-muted-foreground italic">No results found.</span>
    </div>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {filteredSpaces.map((space) => (
        <SpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}
