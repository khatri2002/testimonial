import * as z from "zod";

export const otpFormSchema = z.object({
  otp: z.string().length(5),
});
