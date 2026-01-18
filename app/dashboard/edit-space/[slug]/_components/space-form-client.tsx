"use client";

import { editSpace } from "@/actions/testimonial";
import SpaceForm from "@/components/space-form/page";
import { SpaceSchema } from "@/lib/schema.types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface SpaceFormClientProps {
  id: string;
  defaultValues: SpaceSchema;
  previewImages: {
    image?: string;
    thankYouImage?: string;
  };
  storedSlug: string;
}

export default function SpaceFormClient({
  id,
  defaultValues,
  previewImages,
  storedSlug,
}: SpaceFormClientProps) {
  const router = useRouter();
  const [isEditing, startEditSpace] = useTransition();

  const onSubmit = (data: SpaceSchema) => {
    startEditSpace(async () => {
      const {
        basics: { image, ...restBasics },
        prompts,
        thank_you_screen: { thank_you_image, ...restThankYouScreen },
        extra_settings,
      } = data;

      const fd = new FormData();
      fd.append("basics", JSON.stringify(restBasics));
      fd.append("prompts", JSON.stringify(prompts));
      fd.append("thank_you_screen", JSON.stringify(restThankYouScreen));
      fd.append("extra_settings", JSON.stringify(extra_settings));
      if (image) fd.append("image", image);
      if (thank_you_image) fd.append("image", thank_you_image);

      try {
        const { success, message } = await editSpace(id, fd);
        if (!success) {
          toast.error(message);
          return;
        }

        toast.success("Space edited");
        router.push("/dashboard");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  return (
    <SpaceForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isLoading={isEditing}
      previewImages={previewImages}
      storedSlug={storedSlug}
    />
  );
}
