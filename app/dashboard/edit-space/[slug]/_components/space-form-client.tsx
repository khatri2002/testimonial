"use client";

import SpaceForm from "@/components/space-form/page";
import { SpaceSchema } from "@/lib/schema.types";

interface SpaceFormClientProps {
  defaultValues: SpaceSchema;
  previewImages: {
    image?: string;
    thankYouImage?: string;
  };
  storedSlug: string;
}

export default function SpaceFormClient({
  defaultValues,
  previewImages,
  storedSlug,
}: SpaceFormClientProps) {
  return (
    <SpaceForm
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={() => {}}
      isLoading={false}
      previewImages={previewImages}
      storedSlug={storedSlug}
    />
  );
}
