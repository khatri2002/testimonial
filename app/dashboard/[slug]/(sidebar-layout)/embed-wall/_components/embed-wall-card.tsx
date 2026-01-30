import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmbedWall } from "@/prisma/src/generated/prisma/client";
import { format } from "date-fns";
import { CircleCheckBig, Clock, Ellipsis } from "lucide-react";
import Link from "next/link";
import EmbedWallCardActions from "./embed-wall-card-actions";

interface EmbedWallCardProps {
  embedWall: EmbedWall;
  slug: string;
}

export default function EmbedWallCard({ embedWall, slug }: EmbedWallCardProps) {
  const { id, name, published, created_at } = embedWall;

  const publishState = published
    ? { icon: CircleCheckBig, label: "Published" }
    : { icon: Clock, label: "Not published" };

  return (
    <DropdownMenu>
      <Link href={`/dashboard/${slug}/embed-wall/${id}/edit`} className="block">
        <div className="bg-card hover:bg-card/80 space-y-3 rounded-lg border p-3 transition-colors">
          <div className="flex items-center justify-between">
            <span>{name}</span>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                className="focus-visible:ring-0"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
          </div>

          <div className="flex items-end justify-between text-sm">
            <div className="text-muted-foreground flex items-center gap-1">
              <publishState.icon className="size-4" />
              <span>{publishState.label}</span>
            </div>
            <div className="flex flex-col items-end">
              <span>Created on</span>
              <span className="text-muted-foreground">
                {format(created_at, "MMM d, yyyy, h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <EmbedWallCardActions id={id} published={published} />
    </DropdownMenu>
  );
}
