import * as z from "zod";
import { borderRadiusOptions, themeOptions } from "./config";

const fieldValidationsSchema = z.object({
  type: z.enum(["number", "string", "email", "boolean"]),
  required: z.boolean(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
});

const fieldSchema = z.object({
  field_key: z.string().trim().nonempty(),
  label: z.string().trim().nonempty(),
  type: z.enum(["textbox", "textarea", "checkbox", "rating"]),
  validations: fieldValidationsSchema,
  category: z.enum(["core", "suggested", "custom"]),
  active: z.boolean(),
  disabled: z.boolean(),
});

const basicsSchema = z.object({
  name: z.string().trim().nonempty("Space name is required"),
  slug: z
    .string()
    .trim()
    .nonempty("Public URL is required")
    .regex(/^[a-z0-9-]+$/, {
      error: "URL must contain only lowercase letters, numbers, and hyphens",
    })
    .regex(/^(?!-)(?!.*-$).+/, {
      error: "URL cannot start or end with a hyphen",
    }),
  image: z.instanceof(File).optional(),
  header_title: z.string().trim().nonempty("Header title is required"),
  message: z.string().trim().nonempty("Message is required"),
  collect_star_rating: z.boolean(),
  extra_information: z.array(fieldSchema),
  dark_mode: z.boolean(),
});

const questionsSchema = z.object({
  question: z.string().trim().nonempty(),
});

const promptsSchema = z
  .object({
    question_label: z.string().trim().optional(),
    questions: z.array(questionsSchema),
  })
  .superRefine((data, ctx) => {
    if (data.questions.length > 0)
      if (!data.question_label || data.question_label.length === 0)
        ctx.addIssue({
          path: ["question_label"],
          code: "custom",
          message: "Question label is required when questions are provided",
        });
  });

const thankYouSchema = z.object({
  thank_you_image: z.instanceof(File).optional(),
  thank_you_title: z.string().trim().nonempty("Thank you title is required"),
  thank_you_message: z
    .string()
    .trim()
    .nonempty("Thank you message is required"),
});

const extraSettingsSchema = z
  .object({
    max_testimonial_chars: z.union([
      z.literal(""),
      z.coerce.number().min(10, "Cannot be less than 10"),
    ]),
    send_btn_text: z.string().trim().nonempty("Send button text is required"),
    consent_display: z.enum(["required", "optional", "hidden"]),
    consent_statement: z.string().trim().optional(),
    verify_email: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.consent_display !== "hidden")
      if (!data.consent_statement || data.consent_statement.length === 0)
        ctx.addIssue({
          path: ["consent_statement"],
          code: "custom",
          message: `Consent statement is required when consent display is ${data.consent_display}`,
        });
  });

export const spaceSchema = z.object({
  basics: basicsSchema,
  prompts: promptsSchema,
  thank_you_screen: thankYouSchema,
  extra_settings: extraSettingsSchema,
});

export const embedWallSchema = z.object({
  name: z.string(),
  components_visibility: z.object({
    show_date: z.boolean(),
    show_title: z.boolean(),
    show_company: z.boolean(),
    show_star_rating: z.boolean(),
  }),
  themes_colors: z.object({
    theme: z.enum(themeOptions.map((option) => option.value)),
    page_bg_color: z.string(),
    card_bg_color: z.string(),
    text_primary_color: z.string(),
    text_secondary_color: z.string(),
    border_color: z.string(),
  }),
  layout_borders: z.object({
    card_gap: z.number(),
    border_thickness: z.number(),
    border_radius: z.enum(borderRadiusOptions),
  }),
});
