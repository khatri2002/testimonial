import { OTP_LENGTH } from "@/lib/constants";
import * as z from "zod";

export const otpForm = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(OTP_LENGTH, `OTP must be of ${OTP_LENGTH} characters`),
});
