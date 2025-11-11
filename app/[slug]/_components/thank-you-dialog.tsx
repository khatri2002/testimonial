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
import Image from "next/image";

interface ThankYouDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function ThankYouDialog({
  open,
  handleOpenChange,
}: ThankYouDialogProps) {
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
            Thank you for your response!
          </DialogTitle>
          <DialogDescription className="text-center sm:text-lg">
            Thank you for taking your time out to submit the form. We really
            appreciate it.
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
