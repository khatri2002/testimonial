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

export function ThankYouDialog({
  open,
  handleOpenChange,
}: ThankYouDialogProps) {
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
            Thank you for your response
          </DialogTitle>
          <DialogDescription className="text-center">
            Thank you for taking your time out to submit the form. We really
            appreciate it.
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
