"use client";

import Fuse from "fuse.js";
import { Grid2x2X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { TransformedResponse } from "../../_lib/types";
import { useSearchStore } from "../_lib/useSearchStore";
import ResponseCard from "./response-card";

interface ResponseCardsProps {
  responses: TransformedResponse[];
}

export default function ResponseCards({ responses }: ResponseCardsProps) {
  const query = useSearchStore((state) => state.query);
  const [debouncedQuery] = useDebounce(query, 700);

  const fuse = new Fuse(responses, {
    keys: ["answers.name.value", "answers.testimonial.value"],
    threshold: 0.3,
  });

  const filteredResponses = debouncedQuery
    ? fuse.search(debouncedQuery).map((result) => result.item)
    : responses;

  return filteredResponses.length > 0 ? (
    <div className="grid gap-3 lg:grid-cols-2">
      {filteredResponses.map((response) => (
        <ResponseCard key={response.id} response={response} />
      ))}
    </div>
  ) : (
    <div className="text-muted-foreground flex flex-col items-center gap-4 p-10 text-sm sm:text-base">
      <Grid2x2X className="size-9 sm:size-11" />
      <p className="text-center">
        There are no testimonials matching your current search
      </p>
    </div>
  );
}
