"use client";

import { EmbedWallContextData } from "./_lib/types";
import { useEmbedWallStore } from "./_lib/useEmbedWallStore";
import LayoutClient from "./layout.client";

type ClientBoundaryProps = EmbedWallContextData;

export default function ClientBoundary({
  responsesById,
  includedIds,
}: ClientBoundaryProps) {
  const hydrate = useEmbedWallStore((state) => state.hydrate);
  hydrate({ responsesById, includedIds });

  return <LayoutClient />;
}
