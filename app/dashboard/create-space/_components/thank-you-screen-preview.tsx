import { Button } from "@/components/ui/button";
import { CreateSpaceSchema } from "@/lib/schema.types";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";

export default function ThankYouScreenPreview() {
  const { control } = useFormContext<CreateSpaceSchema>();

  const { thank_you_image, thank_you_title, thank_you_message } = useWatch({
    control,
    name: "thank_you_screen",
  });

  const previewImage = thank_you_image && URL.createObjectURL(thank_you_image);

  return (
    <div className="mx-auto grid max-w-[calc(100%-2rem)] min-w-93.75 gap-4 rounded-lg border p-6 @sm:max-w-lg">
      {previewImage && (
        <Image
          src={previewImage}
          width={0}
          height={0}
          alt="thank-you-image-preview"
          sizes="100vw"
          className="h-auto w-full rounded"
        />
      )}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-foreground text-center text-xl font-semibold">
          {thank_you_title || "Thank you title goes here..."}
        </h2>
        <p className="text-muted-foreground text-center text-sm">
          {thank_you_message || "Thank you message goes here..."}
        </p>
      </div>
      <Button variant="default" className="w-full">
        Close
      </Button>
    </div>
  );
}
