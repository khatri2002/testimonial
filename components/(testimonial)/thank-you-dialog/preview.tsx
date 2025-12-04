import { CreateSpaceSchema } from "@/app/dashboard/create-space/_lib/schema.types";
import CldImage from "@/components/cld-image";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

export default function ThankYouDialogPreview() {
  const { watch } = useFormContext<CreateSpaceSchema>();
  const {
    thank_you: { title, message, image },
  } = watch();

  const previewImage = image && URL.createObjectURL(image);

  return (
    <div className="bg-background @container min-w-[370px] p-4">
      <div className="mx-auto max-w-[32rem] space-y-4 rounded-lg border p-6">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="thank-you-preview"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded"
          />
        ) : (
          <CldImage
            src="testimonial-thank-you"
            alt="thank-you-preview"
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded"
          />
        )}
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-semibold @sm:text-2xl">
            {title || "Thank you for your response!"}
          </h2>
          <p className="text-muted-foreground text-sm @sm:text-lg">
            {message ||
              "Thank you for taking your time out to submit the form. We really appreciate it."}
          </p>
        </div>
        <Button variant="secondary" className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
}
