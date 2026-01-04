import * as z from "zod";
import { otpFormSchema, testimonialFormSchema } from "./schema";

export type TestimonialFormSchema = z.infer<typeof testimonialFormSchema>;
export type OtpFormSchema = z.infer<typeof otpFormSchema>;
