import * as z from "zod";
import { otpFormSchema } from "./schema";

export type OtpFormSchema = z.infer<typeof otpFormSchema>;
