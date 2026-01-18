import { SpaceSchema } from "@/lib/schema.types";
import { CloudinaryImage, FieldValidations } from "@/lib/types";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
import SpaceFormClient from "./_components/space-form-client";

interface EditSpaceProps {
  params: Promise<{ slug: string }>;
}

export default async function EditSpace({ params }: EditSpaceProps) {
  const { slug } = await params;

  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      fields: {
        where: { category: "suggested" },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!space) notFound();

  const {
    id,
    name,
    image: rawImage,
    header_title,
    message,
    fields,
    theme,
    question_label,
    questions,
    thank_you_image: rawThankYouImage,
    thank_you_title,
    thank_you_message,
    send_btn_text,
    verify_email,
    collect_star_rating,
    max_testimonial_chars,
    consent_display,
    consent_statement,
  } = space;

  const defaultValues: SpaceSchema = {
    basics: {
      name,
      slug,
      header_title,
      message,
      collect_star_rating,
      extra_information: fields.map(({ validations, disabled, ...rest }) => {
        return {
          ...rest,
          validations: validations as FieldValidations,
          disabled: disabled ? true : false,
        };
      }),
      dark_mode: theme === "dark",
    },
    prompts: {
      question_label: question_label ?? undefined,
      questions: questions.map((question) => {
        return { question };
      }),
    },
    thank_you_screen: {
      thank_you_title,
      thank_you_message,
    },
    extra_settings: {
      max_testimonial_chars: max_testimonial_chars || "",
      send_btn_text,
      consent_display,
      consent_statement: consent_statement ?? undefined,
      verify_email,
    },
  };

  const image = rawImage as CloudinaryImage | null;
  const thankYouImage = rawThankYouImage as CloudinaryImage | null;
  const previewImages = {
    image: image?.url,
    thankYouImage: thankYouImage?.url,
  };

  return (
    <SpaceFormClient
      id={id}
      defaultValues={defaultValues}
      previewImages={previewImages}
      storedSlug={slug}
    />
  );
}
