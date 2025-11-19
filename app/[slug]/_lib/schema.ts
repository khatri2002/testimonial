import * as z from "zod";

export const otpForm = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(4, "OTP must be of 4 characters"),
});
