import * as z from "zod";
import { otpForm } from "./schema";

export type OtpForm = z.infer<typeof otpForm>;
