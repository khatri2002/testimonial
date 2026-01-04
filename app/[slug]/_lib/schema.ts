import * as z from "zod";

export const testimonialFormSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  testimonial: z
    .string()
    .min(1, "Testimonial is required")
    .max(100, "Cannot exceed 100 characters"),
  name: z.string().min(1, "Name is required"),
  email: z
    .union([z.literal(""), z.email("Invalid email")])
    .refine((val) => val !== "", { error: "Email is required" }),
  consent: z.literal<boolean>(true, "Consent is required"),
});

export const otpFormSchema = z.object({
  otp: z.string().length(5),
});
