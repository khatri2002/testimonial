"use client";

import TestimonialCards from "@/components/testimonial-cards";
import { Button } from "@/components/ui/button";
import { getTestimonialWallEmbedCode } from "@/lib/testimonialWallEmbed";
import { cn } from "@/lib/utils";
import { Prisma } from "@/prisma/src/generated/prisma/client";
import { Check, CircleCheckBig, Clock, Copy } from "lucide-react";
import { useState } from "react";

interface EmbedWallPreviewLayoutProps {
  embedWall: Prisma.EmbedWallGetPayload<{
    include: { embedWallResponses: { include: { response: true } } };
  }>;
  id: string;
}

export default function EmbedWallPreviewLayout({
  embedWall,
  id,
}: EmbedWallPreviewLayoutProps) {
  const [copied, setCopied] = useState(false);

  const publishState = embedWall.published
    ? {
        icon: CircleCheckBig,
        label: "Published",
        textClass: "text-green-500",
      }
    : { icon: Clock, label: "Not published", textClass: "text-gray-400" };

  const copyState = copied
    ? { icon: Check, label: "Copied" }
    : { icon: Copy, label: "Copy embed code" };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTestimonialWallEmbedCode(id));
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <div className="bg-card flex flex-col items-center justify-between gap-2 px-6 py-3 sm:flex-row sm:py-4">
        <span className="sm:text-lg">Preview mode</span>

        <div className="flex w-full items-center justify-between gap-6 sm:w-auto">
          <span
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              publishState.textClass,
            )}
          >
            <publishState.icon className="size-4 sm:size-5" />
            {publishState.label}
          </span>
          {embedWall.published && (
            <Button onClick={handleCopy} disabled={copied}>
              <copyState.icon />
              {copyState.label}
            </Button>
          )}
        </div>
      </div>

      <TestimonialCards embedWall={embedWall} />
    </>
  );
}
