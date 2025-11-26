import { FormField } from "@/lib/types";
import crypto from "crypto";

export const generateSecureOtp = (length: number) => {
  const max = 10 ** length;
  const otp = crypto.randomInt(0, max).toString().padStart(length, "0");
  return otp;
};

export const replaceKeysWithLabels = (
  data: Record<string, unknown>,
  fields: Array<FormField>,
): Record<string, unknown> => {
  const map = Object.fromEntries(
    fields.map((field) => [field.name, field.label]),
  );

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const newKey = map[key] || key; // fallback to original key if no match
    result[newKey] = value;
  }

  return result;
};
