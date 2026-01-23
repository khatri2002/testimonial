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
import TestimonialCardSelectable from "./testimonial-card-selectable";

interface SelectTestimonialDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function SelectTestimonialDialog({
  open,
  handleOpenChange,
}: SelectTestimonialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-7xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Update testimonial selection</DialogTitle>
        </DialogHeader>
        <div className="max-h-[85vh] space-y-4 overflow-scroll">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox className="data-[state=checked]:bg-theme-primary! size-6 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select all</p>
              </TooltipContent>
            </Tooltip>
            <Input placeholder="Search by name or keyword..." />
          </div>
          <p className="text-muted-foreground text-center text-sm">
            2 of 10 selected
          </p>
          <div className="grid grid-cols-3 gap-4 p-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <TestimonialCardSelectable
                key={index}
                selected={index % 5 === 0}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
