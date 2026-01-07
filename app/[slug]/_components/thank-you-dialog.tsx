import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Space } from "@/prisma/src/generated/prisma/client";
import Image from "next/image";

interface ThankYouDialogProps {
  space: Space;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function ThankYouDialog({
  space,
  open,
  handleOpenChange,
}: ThankYouDialogProps) {
  const { thank_you_title, thank_you_message } = space;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <Image
          src="/placeholder.png"
          alt=""
          width={462}
          height={160}
          className="h-43 w-full rounded-md object-cover"
        />
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {thank_you_title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {thank_you_message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
