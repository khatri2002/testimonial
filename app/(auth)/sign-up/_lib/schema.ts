import * as z from "zod";

export const signUpSchema = z.object({
  terms_service: z.literal(true),
});
