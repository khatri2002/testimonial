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
import { Space_thank_you_screen } from "@/prisma/app/generated/prisma/client";
import Image from "next/image";

interface ThankYouDialogProps {
  spaceThankYouScreen: Space_thank_you_screen;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function ThankYouDialog({
  spaceThankYouScreen,
  open,
  handleOpenChange,
}: ThankYouDialogProps) {
  const { title, message } = spaceThankYouScreen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <div className="relative w-full h-30 sm:h-42">
          <Image
            src="/placeholder.png"
            alt="thank-you"
            fill
            className="object-cover rounded"
          />
        </div>

        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center sm:text-lg">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
