import { InputJsonValue } from "@/prisma/src/generated/prisma/internal/prismaNamespace";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

export const generateSecureOtp = (length: number) => {
  const max = 10 ** length;
  const otp = crypto.randomInt(0, max).toString().padStart(length, "0");
  return otp;
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
