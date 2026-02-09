"use client";

import { Button } from "@/components/ui/button";
import { JSFIDDLE_URL } from "@/constants";
import { getTestimonialWallEmbedCode } from "@/lib/testimonialWallEmbed";
import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { domain, wallId } from "../lib/config";

export default function EmbedCode() {
  const embedCode = getTestimonialWallEmbedCode(wallId, domain);

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
    <div className="bg-card max-w-full space-y-4 rounded-lg border p-5 md:max-w-2xl">
      <h3 className="text-lg">Try our sample embed code</h3>
      <div className="bg-input overflow-x-auto rounded-md p-3">
        <pre className="text-sm">{embedCode}</pre>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleCopy} disabled={copied}>
          <copyState.icon />
          {copyState.label}
        </Button>
        <Link href={JSFIDDLE_URL} target="_blank">
          <Button>
            Live demo
            <ExternalLink />
          </Button>
        </Link>
      </div>
    </div>
  );
}
