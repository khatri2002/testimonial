"use client";

import { Input } from "@/components/ui/input";
import { Response } from "@/prisma/app/generated/prisma/client";
import Fuse from "fuse.js";
import { MessageCircleDashed } from "lucide-react";
import { useMemo, useState } from "react";
import ResponseCard from "./response-card";

interface InboxContentClientProps {
  responses: Array<Response>;
}

export default function InboxContentClient({
  responses,
}: InboxContentClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResponses = useMemo(() => {
    const fuse = new Fuse(responses, {
      keys: ["response.Name", "response.Testimonial"],
      threshold: 0.3,
    });
    if (!searchQuery.trim()) return responses;
    return fuse.search(searchQuery).map((r) => r.item);
  }, [searchQuery, responses]);

  return responses.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <MessageCircleDashed size={40} className="text-muted-foreground" />
      <span className="text-muted-foreground">No testimonials yet</span>
    </div>
  ) : (
    <>
      <Input
        value={searchQuery}
        placeholder="Search by name or keyword"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredResponses.length === 0 ? (
        <div className="flex justify-center p-8">
          <span className="text-muted-foreground italic">No results found</span>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {filteredResponses.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))}
        </div>
      )}
    </>
  );
}
