import * as z from "zod";

export const testimonialForm = z.object({
  rating: z.number().positive("Rating is required"),
  testimonial: z.string().trim().min(1, "Testimonial is required"),
  name: z.string().trim().min(1, "Name is required"),
  organization: z.string().trim().min(1, "Organization is required"),
  email: z
    .union([
      z.literal(""), // allow empty temporarily
      z.email("Invalid email"),
    ])
    .refine((val) => val !== "", {
      message: "Email is required",
    }),
  photo: z.instanceof(File, { error: "Photo is required" }),
  consent: z.literal<boolean>(true),
});
