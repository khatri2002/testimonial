import CldImage from "@/components/cld-image";
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
import { CloudinaryImage } from "@/lib/types";
import { Space } from "@/prisma/src/generated/prisma/client";

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
  const {
    thank_you_image: rawThankYouImage,
    thank_you_title,
    thank_you_message,
  } = space;

  const thankYouImage = rawThankYouImage as CloudinaryImage | null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="[&>button]:hidden">
        {thankYouImage && (
          <CldImage
            src={thankYouImage.public_id}
            width={thankYouImage.width}
            height={thankYouImage.height}
            alt="testimonial thank-you image"
            loading="eager"
            sizes="100vw"
            className="rounded"
          />
        )}
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
