import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTestimonialWallEmbedCode } from "@/lib/testimonialWallEmbed";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface PublishedDialogProps {
  id: string | null;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function PublishedDialog({
  id,
  open,
  handleOpenChange,
}: PublishedDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!id) return null; // safety check

  const embedCode = getTestimonialWallEmbedCode(id);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Embed Wall Published</DialogTitle>
          <DialogDescription>
            Your embed wall is live! Use the code below to embed it on your
            website.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted flex overflow-x-auto rounded-md p-5">
          <pre className="text-sm">{embedCode}</pre>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={copied} onClick={handleCopy}>
            {copied ? (
              <>
                <Check />
                Copied!
              </>
            ) : (
              <>
                <Copy />
                Copy the code
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
