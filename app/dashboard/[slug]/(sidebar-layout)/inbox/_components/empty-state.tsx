"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, MessageSquareText } from "lucide-react";
import { useState } from "react";

interface EmptyStateProps {
  slug: string;
}

export default function EmptyState({ slug }: EmptyStateProps) {
  const [copied, setCopied] = useState(false);
  const domain = process.env.NEXT_PUBLIC_APP_URL;

  const copyState = copied
    ? {
        icon: Check,
        label: "Copied",
      }
    : {
        icon: Copy,
        label: "Copy link",
      };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${domain}/${slug}`);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-card flex flex-col items-center rounded-lg p-7">
      <MessageSquareText className="text-muted-foreground size-10" />
      <div className="mt-4 space-y-1 text-center">
        <h3 className="text-lg">No testimonials yet</h3>
        <p className="text-muted-foreground text-sm">
          Share your space link with customers and their feedback will appear
          here.
        </p>
      </div>
      <Button className="mt-4" onClick={handleCopy} disabled={copied}>
        <copyState.icon />
        {copyState.label}
      </Button>
    </div>
  );
}
