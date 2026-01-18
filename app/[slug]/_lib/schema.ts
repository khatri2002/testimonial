import { OTP_LENGTH } from "@/lib/config";
import * as z from "zod";

export const otpFormSchema = z.object({
  otp: z.string().length(OTP_LENGTH),
});
