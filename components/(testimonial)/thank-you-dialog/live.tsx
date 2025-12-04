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
import { CloudinaryImgSrc } from "@/lib/types";
import { Space_thank_you_screen } from "@/prisma/app/generated/prisma/client";

interface ThankYouDialogProps {
  spaceThankYouScreen: Space_thank_you_screen;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function ThankYouDialogLive({
  spaceThankYouScreen,
  open,
  handleOpenChange,
}: ThankYouDialogProps) {
  const { title, message, image_src } = spaceThankYouScreen;
  const imgSrc = image_src as CloudinaryImgSrc;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <CldImage
          src={imgSrc.public_id}
          width={imgSrc.width}
          height={imgSrc.height}
          sizes="100vw"
          alt="testimonial-thank-you"
          className="rounded"
        />

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
