import { Field } from "@/prisma/src/generated/prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { FieldValidations } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildTestimonialSchema = (fields: Array<Field>) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  fields.forEach((field) => {
    const { label, field_key, validations: rawValidations } = field;
    const validations = rawValidations as FieldValidations;
    const { type, required, maxLength, minLength } = validations;

    let schema;

    switch (type) {
      case "number":
        schema = z.number();
        if (required)
          schema = schema.refine((val) => val, {
            error: `${label} is required`,
          });
        if (maxLength)
          schema = schema.max(maxLength, `Cannot exceed ${maxLength}`);
        if (minLength)
          schema = schema.min(minLength, `Cannot be less than ${minLength}`);

        defaultValues[field_key] = 0;
        break;

      case "string":
        schema = z.string().trim();
        if (required)
          schema = schema.refine((val) => val, {
            error: `${label} is required`,
          });
        if (maxLength)
          schema = schema.max(maxLength, `Cannot exceed ${maxLength}`);
        if (minLength)
          schema = schema.min(minLength, `Cannot be less than ${minLength}`);

        defaultValues[field_key] = "";
        break;

      case "email":
        schema = z.union([z.literal(""), z.email("Invalid email")]);
        if (required)
          schema = schema.refine((val) => val, {
            error: `${label} is required`,
          });

        defaultValues[field_key] = "";
        break;

      case "boolean":
        schema = z.boolean();
        if (required)
          schema = schema.refine((val) => val, {
            error: "Required",
          });

        defaultValues[field_key] = false;
        break;
    }

    shape[field_key] = schema;
  });

  return { schema: z.object(shape), defaultValues };
};
