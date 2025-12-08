import z from "zod";

const systemFieldSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  type: z.enum(["text", "email"]),
  name: z.string(),
  required: z.boolean(),
  include: z.boolean(),
  disabled: z.boolean(),
});
const userFieldSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  type: z.enum(["text", "email"]),
  name: z.string(),
  required: z.boolean(),
});

const promptsQuestionsSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
});

export const createSpaceSchema = z.object({
  basics: z.object({
    name: z.string().trim().min(1, "Name is required"),
    slug: z
      .string()
      .trim()
      .min(1, "Public URL is required")
      .regex(/^(?!-)(?!.*--)[a-z0-9-]+(?<!-)$/, "Invalid public URL"),
    header: z.string().trim().min(1, "Header is required"),
    message: z.string().trim().min(1, "Message is required"),
    image: z.instanceof(File).optional(),
    extra_fields_system: z
      .array(systemFieldSchema)
      .min(1, "At least one field is required"),
    extra_fields_user: z.array(userFieldSchema),
    collect_star_ratings: z.boolean(),
    photo_field_mode: z.enum(["required", "optional", "hidden"]),
  }),
  prompts: z.object({
    questions_label: z.string().trim(),
    questions: z.array(promptsQuestionsSchema),
  }),
  thank_you: z
    .object({
      type: z.enum(["display", "redirect"]),
      image: z.instanceof(File).optional(),
      title: z.string().trim(),
      message: z.string().trim(),
      redirect_url: z.string(),
    })
    .refine(({ type, redirect_url }) => type !== "redirect" || redirect_url, {
      error: "Redirect URL is required",
      path: ["redirect_url"],
    })
    .refine(
      ({ type, redirect_url }) => {
        if (type === "redirect" && redirect_url) {
          const re =
            /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
          return re.test(redirect_url);
        }
        return true;
      },
      {
        error: "Invalid URL",
        path: ["redirect_url"],
      },
    ),
  extra_settings: z.object({
    send_btn_text: z.string().trim(),
    max_testimonial_chars: z.union([
      z.literal(""),
      z.coerce.number("number error").gt(0, "Must be > 0"),
    ]),
    consent_field_mode: z.enum(["required", "optional", "hidden"]),
    consent_text: z.string().trim(),
    verify_submitted_email: z.boolean(),
    theme: z.enum(["dark", "light"]),
  }),
});
