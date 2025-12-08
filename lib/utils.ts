import { Prisma } from "@/prisma/app/generated/prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { FormField } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeCall = async (
  promise: Promise<{ success: boolean; message: string }>,
) => {
  try {
    const { success, message } = await promise;

    return { ok: success, message };
  } catch (err) {
    return { ok: false, message: "Unexpected error occured" };
  }
};

export const buildFormClient = (
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true;
        };
      };
      spaceExtraSettings: true;
    };
  }>,
) => {
  const { spaceBasics, spaceExtraSettings } = space;

  const shape: Record<string, z.ZodTypeAny> = {};
  const fields: Array<FormField> = [];

  // rating
  if (spaceBasics?.collect_star_ratings) {
    const ratingSchema = z.number().positive("Rating is required");
    shape["rating"] = ratingSchema;
    fields.push({
      name: "rating",
      type: "starRating",
      label: "Rating",
      defaultValue: 0,
    });
  }

  // testimonial
  let testimonialSchema = z.string().trim().min(1, "Testimonial is required");
  const maxChars = spaceExtraSettings?.max_testimonial_chars;
  if (maxChars) {
    testimonialSchema = testimonialSchema.max(
      maxChars,
      `Cannot exceed ${maxChars} characters`,
    );
  }
  shape["testimonial"] = testimonialSchema;
  fields.push({
    name: "testimonial",
    type: "textarea",
    label: "Testimonial",
    defaultValue: "",
    placeholder: "Write your testimonial here...",
    ...(maxChars && { maxChars }),
  });

  // extra fields
  spaceBasics?.spaceBasicExtraFields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "text":
        fieldSchema = z.string().trim();
        if (field.required)
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        break;

      case "email":
        fieldSchema = z.preprocess(
          (val) => (typeof val === "string" ? val.trim() : val),
          z.union([z.literal(""), z.email(`Invalid ${field.label}`)]),
        );
        if (field.required)
          fieldSchema = fieldSchema.refine((val) => val !== "", {
            message: `${field.label} is required`,
          });
        break;
    }
    shape[field.name] = fieldSchema;

    fields.push({
      name: field.name,
      type: "textInput",
      label: field.label,
      defaultValue: "",
      required: field.required,
    });
  });

  // photo
  const photoFieldMode = spaceBasics?.photo_field_mode;
  if (photoFieldMode !== "hidden") {
    const photoSchema =
      photoFieldMode === "required"
        ? z.instanceof(File, { error: "Photo is required" })
        : z.instanceof(File).optional();
    shape["photo"] = photoSchema;
    fields.push({
      name: "photo",
      label: "Photo",
      type: "photoUpload",
      defaultValue: undefined,
      required: photoFieldMode === "required",
    });
  }

  // consent
  const consentFieldMode = spaceExtraSettings?.consent_field_mode;
  if (consentFieldMode !== "hidden") {
    const consentSchema =
      consentFieldMode === "required" ? z.literal<boolean>(true) : z.boolean();
    shape["consent"] = consentSchema;
    fields.push({
      name: "consent",
      type: "checkbox",
      label:
        "I give permission to use this testimonial across social channels and other marketing efforts",
      defaultValue: false,
      required: consentFieldMode === "required",
    });
  }

  // email for OTP verification
  // only add if not already present in extra fields
  if (
    spaceExtraSettings?.verify_submitted_email &&
    !spaceBasics?.spaceBasicExtraFields.some((field) => field.type === "email")
  ) {
    const emailSchema = z
      .union([
        z.literal(""), // allow empty temporarily
        z.email("Invalid email"),
      ])
      .refine((val) => val !== "", {
        message: "Email is required",
      });
    shape["email"] = emailSchema;
    fields.push({
      name: "email",
      type: "textInput",
      label: "Email",
      defaultValue: "",
      tooltip: "Your email address will not be shared publicly.",
    });
  }

  return { schema: z.object(shape), fields };
};

export const buildFormServer = (
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true;
        };
      };
      spaceExtraSettings: true;
    };
  }>,
) => {
  const { spaceBasics, spaceExtraSettings } = space;

  const shape: Record<string, z.ZodTypeAny> = {};
  const fields: Array<FormField> = [];

  // rating
  if (spaceBasics?.collect_star_ratings) {
    const ratingSchema = z.number().positive("Rating is required");
    shape["rating"] = ratingSchema;
    fields.push({
      name: "rating",
      type: "starRating",
      label: "Rating",
      defaultValue: 0,
    });
  }

  // testimonial
  let testimonialSchema = z.string().trim().min(1, "Testimonial is required");
  const maxChars = spaceExtraSettings?.max_testimonial_chars;
  if (maxChars) {
    testimonialSchema = testimonialSchema.max(
      maxChars,
      `Cannot exceed ${maxChars} characters`,
    );
  }
  shape["testimonial"] = testimonialSchema;
  fields.push({
    name: "testimonial",
    type: "textarea",
    label: "Testimonial",
    defaultValue: "",
    placeholder: "Write your testimonial here...",
    ...(maxChars && { maxChars }),
  });

  // extra fields
  spaceBasics?.spaceBasicExtraFields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "text":
        fieldSchema = z.string().trim();
        if (field.required)
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        break;

      case "email":
        fieldSchema = z.preprocess(
          (val) => (typeof val === "string" ? val.trim() : val),
          z.union([z.literal(""), z.email(`Invalid ${field.label}`)]),
        );
        if (field.required)
          fieldSchema = fieldSchema.refine((val) => val !== "", {
            message: `${field.label} is required`,
          });
        break;
    }
    shape[field.name] = fieldSchema;

    fields.push({
      name: field.name,
      type: "textInput",
      label: field.label,
      defaultValue: "",
      required: field.required,
    });
  });

  // consent
  const consentFieldMode = spaceExtraSettings?.consent_field_mode;
  if (consentFieldMode !== "hidden") {
    const consentSchema =
      consentFieldMode === "required" ? z.literal<boolean>(true) : z.boolean();
    shape["consent"] = consentSchema;
    fields.push({
      name: "consent",
      type: "checkbox",
      label:
        "I give permission to use this testimonial across social channels and other marketing efforts",
      defaultValue: false,
      required: consentFieldMode === "required",
    });
  }

  // email for OTP verification
  // only add if not already present in extra fields
  if (
    spaceExtraSettings?.verify_submitted_email &&
    !spaceBasics?.spaceBasicExtraFields.some((field) => field.type === "email")
  ) {
    const emailSchema = z
      .union([
        z.literal(""), // allow empty temporarily
        z.email("Invalid email"),
      ])
      .refine((val) => val !== "", {
        message: "Email is required",
      });
    shape["email"] = emailSchema;
    fields.push({
      name: "email",
      type: "textInput",
      label: "Email",
      defaultValue: "",
      tooltip: "Your email address will not be shared publicly.",
    });
  }

  return { schema: z.object(shape), fields };
};

export const getDefaultValues = (fields: Array<FormField>) =>
  fields.reduce<Record<string, any>>((acc, item) => {
    acc[item.name] = item.defaultValue;
    return acc;
  }, {});
