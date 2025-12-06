import { CreateSpaceSchema } from "@/lib/schema/schema.types";
import { FormField } from "@/lib/types";
import { InputJsonValue } from "@/prisma/app/generated/prisma/internal/prismaNamespace";
import { v2 as cloudinary } from "cloudinary";
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

export const uploadFileToCloudinary = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, uploadResult) => {
        if (error) {
          return reject(error);
        }
        return resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadResult as InputJsonValue;
};

export const mergeExtraFields = (
  systemFields: CreateSpaceSchema["basics"]["extra_fields_system"],
  userFields: CreateSpaceSchema["basics"]["extra_fields_user"],
): Array<{
  name: string;
  label: string;
  type: "text" | "email";
  required: boolean;
}> => {
  const systemFieldsIncluded = systemFields
    .filter((f) => f.include)
    .map(({ name, label, type, required }) => ({
      name,
      label,
      type,
      required,
    }));

  return [...systemFieldsIncluded, ...userFields];
};
