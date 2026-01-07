import crypto from "crypto";

export const generateSecureOtp = (length: number) => {
  const max = 10 ** length;
  const otp = crypto.randomInt(0, max).toString().padStart(length, "0");
  return otp;
};
