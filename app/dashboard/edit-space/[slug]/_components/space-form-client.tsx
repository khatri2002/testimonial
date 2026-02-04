"use client";

import { editSpace } from "@/actions/testimonial";
import SpaceForm from "@/components/space-form/page";
import { SpaceSchema } from "@/lib/schema.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
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
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // dashboard | inbox | embed-wall
  const [isEditing, startEditSpace] = useTransition();

  const [previewImage, setPreviewImage] = useState<string | undefined>(
    previewImages.image,
  );
  const [previewThankYouImage, setPreviewThankYouImage] = useState<
    string | undefined
  >(previewImages.thankYouImage);

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

      // handle image actions
      if (image) {
        fd.append("image", image);
        fd.append("imageAction", "replace");
      } else {
        if (previewImage) fd.append("imageAction", "keep");
        else fd.append("imageAction", "remove");
      }

      // handle thank you image actions
      if (thank_you_image) {
        fd.append("thank_you_image", thank_you_image);
        fd.append("thankYouImageAction", "replace");
      } else {
        if (previewThankYouImage) fd.append("thankYouImageAction", "keep");
        else fd.append("thankYouImageAction", "remove");
      }

      try {
        const { success, message, data } = await editSpace(id, fd);
        if (!success) {
          toast.error(message);
          return;
        }

        toast.success("Space edited");

        const redirectMap = {
          dashboard: "/dashboard",
          inbox: `/dashboard/${data?.slug}/inbox`,
          "embed-wall": `/dashboard/${data?.slug}/embed-wall`,
        };
        const redirectTo =
          from && from in redirectMap
            ? redirectMap[from as keyof typeof redirectMap]
            : "/dashboard";
        router.push(redirectTo);

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
      previewImage={previewImage}
      previewThankYouImage={previewThankYouImage}
      handleSetPreviewImage={setPreviewImage}
      handleSetPreviewThankYouImage={setPreviewThankYouImage}
      storedSlug={storedSlug}
    />
  );
}
