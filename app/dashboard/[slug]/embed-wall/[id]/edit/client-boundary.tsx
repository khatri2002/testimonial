"use client";

import { embedWallSchema } from "@/lib/schema";
import { EmbedWallSchema } from "@/lib/schema.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { EmbedWallContextData } from "./_lib/types";
import { useEmbedWallStore } from "./_lib/useEmbedWallStore";
import LayoutClient from "./layout.client";

type ClientBoundaryProps = EmbedWallContextData & {
  defaultValues: EmbedWallSchema;
};

export default function ClientBoundary({
  id,
  slug,
  responsesById,
  includedIds,
  published,
  defaultValues,
}: ClientBoundaryProps) {
  const hydrate = useEmbedWallStore((state) => state.hydrate);
  useEffect(() => {
    hydrate({ id, slug, responsesById, includedIds, published });
  }, [hydrate, id, includedIds, published, responsesById, slug]);

  const methods = useForm<EmbedWallSchema>({
    resolver: zodResolver(embedWallSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <LayoutClient />;
    </FormProvider>
  );
}
