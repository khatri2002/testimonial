"use client";

import { createEmbedWall } from "@/actions/embed-wall";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useSearchStore } from "../_lib/useSearchStore";

interface EmbedWallHeaderProps {
  slug: string;
}

export default function EmbedWallHeader({ slug }: EmbedWallHeaderProps) {
  const router = useRouter();

  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

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
    <div className="flex items-center gap-2">
      <InputGroup>
        <InputGroupInput
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <Button onClick={handleCreateEmbedWall} disabled={isCreating}>
        Create embed wall
        {isCreating && <Spinner />}
      </Button>
    </div>
  );
}
