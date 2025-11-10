import * as z from "zod";
import { otpForm, testimonialForm } from "./schema";

export type TestimonialForm = z.infer<typeof testimonialForm>;
export type OtpForm = z.infer<typeof otpForm>;
