"use client";

import { createNewSpace } from "@/actions/testimonial";
import SpaceForm from "@/components/space-form/page";
import { SpaceSchema } from "@/lib/schema.types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function CreateSpace() {
  const router = useRouter();

  const defaultValues: SpaceSchema = {
    basics: {
      name: "",
      slug: "",
      image: undefined,
      header_title: "",
      message: "",
      collect_star_rating: true,
      extra_information: [
        {
          field_key: "name",
          label: "Name",
          type: "textbox",
          validations: { type: "string", required: true },
          category: "suggested",
          active: true,
          disabled: true,
        },
        {
          field_key: "email",
          label: "Email",
          type: "textbox",
          validations: { type: "email", required: true },
          category: "suggested",
          active: true,
          disabled: false,
        },
        {
          field_key: "company",
          label: "Company",
          type: "textbox",
          validations: { type: "string", required: false },
          category: "suggested",
          active: false,
          disabled: false,
        },
        {
          field_key: "title",
          label: "Title",
          type: "textbox",
          validations: { type: "string", required: false },
          category: "suggested",
          active: false,
          disabled: false,
        },
      ],
      dark_mode: true,
    },
    prompts: {
      question_label: "QUESTIONS",
      questions: [
        { question: "Who are you / what are you working on?" },
        { question: "How has [our product / service] helped you?" },
        { question: "What is the best thing about [our product / service]" },
      ],
    },
    thank_you_screen: {
      thank_you_title: "Thank you",
      thank_you_message: "Thank you for your shoutout! It means a ton for us!",
    },
    extra_settings: {
      max_testimonial_chars: "",
      send_btn_text: "Send",
      consent_display: "required",
      consent_statement:
        "I give permission to use this testimonial across social channels and other marketing efforts",
      verify_email: false,
    },
  };

  const [isCreating, startCreateSpace] = useTransition();

  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );
  const [previewThankYouImage, setPreviewThankYouImage] = useState<
    string | undefined
  >(undefined);

  const onSubmit = (data: SpaceSchema) => {
    startCreateSpace(async () => {
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
      if (thank_you_image) fd.append("thank_you_image", thank_you_image);

      try {
        const { success, message } = await createNewSpace(fd);
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success("Space created");
        router.push(`/dashboard/${data.basics.slug}/inbox`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Oops! Something went wrong");
      }
    });
  };

  return (
    <SpaceForm
      mode="create"
      defaultValues={defaultValues}
      previewImage={previewImage}
      previewThankYouImage={previewThankYouImage}
      handleSetPreviewImage={setPreviewImage}
      handleSetPreviewThankYouImage={setPreviewThankYouImage}
      isLoading={isCreating}
      onSubmit={onSubmit}
    />
  );
}
