"use client";

import { Button } from "@/components/ui/button";
import { getTestimonialWallEmbedCode } from "@/lib/testimonialWallEmbed";
import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { wallId } from "../lib/config";

export default function EmbedCode() {
  const embedCode = getTestimonialWallEmbedCode(wallId);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    navigator.clipboard.writeText(embedCode);

    setTimeout(() => setCopied(false), 3000);
  };

  const copyState = copied
    ? {
        icon: Check,
        label: "Copied",
      }
    : {
        icon: Copy,
        label: "Copy the code",
      };

  return (
    <div className="bg-card w-2xl space-y-4 rounded-lg border p-5">
      <h3 className="text-lg">Try our sample embed code</h3>
      <div className="bg-input overflow-x-auto rounded-md p-3">
        <pre className="text-sm">{embedCode}</pre>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleCopy} disabled={copied}>
          <copyState.icon />
          {copyState.label}
        </Button>
        <Link href="/" target="_blank">
          {/* TODO: add jsfiddle link */}
          <Button>
            Live demo
            <ExternalLink />
          </Button>
        </Link>
      </div>
    </div>
  );
}
