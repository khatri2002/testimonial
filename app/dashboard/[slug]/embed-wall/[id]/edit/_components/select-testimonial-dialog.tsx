import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Fuse from "fuse.js";
import { Grid2x2X } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { ResponseWithInclusion } from "../_lib/types";
import { useEmbedWallStore } from "../_lib/useEmbedWallStore";
import TestimonialCardSelectable from "./testimonial-card-selectable";

interface SelectTestimonialDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function SelectTestimonialDialog({
  open,
  handleOpenChange,
}: SelectTestimonialDialogProps) {
  const responsesById = useEmbedWallStore((state) => state.responsesById);
  const includedIds = useEmbedWallStore((state) => state.includedIds);
  const bulkSetResponseInclusion = useEmbedWallStore(
    (state) => state.bulkSetResponseInclusion,
  );

  const responsesWithInclusion: ResponseWithInclusion[] = Object.values(
    responsesById,
  )
    .sort((a, b) => b.submitted_at.getTime() - a.submitted_at.getTime())
    .map((response) => ({
      ...response,
      isIncluded: includedIds.includes(response.id),
    }));

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 700);

  const fuse = new Fuse(responsesWithInclusion, {
    keys: ["answers.name", "answers.testimonial"],
    threshold: 0.3,
  });

  const filteredResponsesWithInclusion = debouncedQuery
    ? fuse.search(debouncedQuery).map((result) => result.item)
    : responsesWithInclusion;

  const hasNoIncludedResponses = includedIds.length === 0;

  const areAllResponsesIncluded = filteredResponsesWithInclusion.every(
    (response) => response.isIncluded,
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-7xl"
        onInteractOutside={(e) => hasNoIncludedResponses && e.preventDefault()}
        onEscapeKeyDown={(e) => hasNoIncludedResponses && e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Update testimonial selection</DialogTitle>
        </DialogHeader>
        <div className="h-[85vh] space-y-4 overflow-scroll">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox
                  className="data-[state=checked]:bg-theme-primary! size-6 cursor-pointer"
                  checked={areAllResponsesIncluded}
                  onCheckedChange={(checked) =>
                    bulkSetResponseInclusion(
                      filteredResponsesWithInclusion.map(
                        (response) => response.id,
                      ),
                      Boolean(checked),
                    )
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{areAllResponsesIncluded ? "Deselect all" : "Select all"}</p>
              </TooltipContent>
            </Tooltip>
            <Input
              placeholder="Search by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <p className="text-muted-foreground text-center text-sm">
            {includedIds.length} of 10 selected
          </p>

          {filteredResponsesWithInclusion.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 p-1">
              {filteredResponsesWithInclusion.map((response) => (
                <TestimonialCardSelectable
                  key={response.id}
                  response={response}
                />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-4 p-10">
              <Grid2x2X className="size-11" />
              <p>There are no testimonials matching your current search</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" disabled={hasNoIncludedResponses}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
