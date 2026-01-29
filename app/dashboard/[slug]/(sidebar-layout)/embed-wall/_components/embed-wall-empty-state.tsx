"use client";

import { createEmbedWall } from "@/actions/embed-wall";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FilePlusCorner } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface EmbedWallEmptyStateProps {
  slug: string;
}

export default function EmbedWallEmptyState({
  slug,
}: EmbedWallEmptyStateProps) {
  const router = useRouter();

  const [isCreating, startCreateEmbedWall] = useTransition();

  const handleCreateEmbedWall = () => {
    startCreateEmbedWall(async () => {
      try {
        const { success, message, data } = await createEmbedWall(slug);
        if (!success) {
          toast.error(message);
          return;
        }
        if (!data) {
          toast.error("Oops! Something went wrong");
          return;
        }

        router.push(`/dashboard/${slug}/embed-wall/${data.id}/edit`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  return (
    <div className="bg-card flex flex-col items-center rounded-lg p-7">
      <FilePlusCorner className="text-muted-foreground size-10" />
      <div className="mt-4 space-y-1 text-center">
        <h3 className="text-lg">No walls yet</h3>
        <p className="text-muted-foreground text-sm">
          Create your first embed wall to start displaying testimonials
        </p>
      </div>
      <Button
        className="mt-4"
        onClick={handleCreateEmbedWall}
        disabled={isCreating}
      >
        Create embed wall
        {isCreating && <Spinner />}
      </Button>
    </div>
  );
}
