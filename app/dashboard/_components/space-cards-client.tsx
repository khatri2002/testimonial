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

  return filteredSpaces.map((space) => (
    <SpaceCard key={space.id} space={space} />
  ));
}
