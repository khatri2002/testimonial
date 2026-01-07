"use server";

import { OTP_LENGTH } from "@/lib/config";
import { sendMail } from "@/lib/mail";
import { getRedisClient } from "@/lib/redis";
import { buildTestimonialSchema } from "@/lib/utils";
import { prisma } from "@/prisma";
import { Prisma } from "@/prisma/src/generated/prisma/client";
import { emailSchema } from "./lib/schema";
import { OtpEmailTemplate } from "./lib/templates";
import { generateSecureOtp } from "./lib/utils";

export const sendOtp = async (email: string) => {
  // validate email
  const result = emailSchema.safeParse(email);
  if (!result.success)
    return { success: false, message: "Invalid email address" };

  // generate OTP
  const otp = generateSecureOtp(OTP_LENGTH);

  // save OTP to redis
  try {
    const client = await getRedisClient();
    await client.set(`otp-${email}`, otp, {
      expiration: { type: "EX", value: 120 },
    });
  } catch (err) {
    return { success: false, message: "Failed to save OTP" };
  }

  // send OTP email
  const res = await sendMail({
    email,
    subject: "Verify your email address",
    template: OtpEmailTemplate({ otp }),
  });
  if (!res.success) return { success: false, message: "Failed to send OTP" };

  return { success: true, message: "OTP sent" };
};

export const saveResponse = async (
  spaceId: string,
  formResponse: Record<string, unknown>,
  otp?: string,
) => {
  // fetch space
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { fields: { where: { active: true } } },
  });
  if (!space) return { success: false, message: "Space not found" };

  // validate response
  const { schema } = buildTestimonialSchema(space.fields);
  const { data, success } = schema.safeParse(formResponse);
  if (!success) return { success: false, message: "Invalid response" };

  // verify OTP if required
  if (space.verify_email) {
    if (!otp) return { success: false, message: "OTP is required" };

    try {
      const client = await getRedisClient();
      const email = data.email; //TODO: 'email' maybe taken from some constant/config
      const savedOtp = await client.get(`otp-${email}`);
      if (otp !== savedOtp) return { success: false, message: "Invalid OTP" };

      // delete OTP after successful verification
      await client.del(`otp-${email}`);
    } catch (err) {
      return { success: false, message: "Failed to verify OTP" };
    }
  }

  // save response
  try {
    await prisma.response.create({
      data: { spaceId, answers: data as Prisma.InputJsonValue },
    });
  } catch (err) {
    return { success: false, message: "Failed to save response" };
  }

  return { success: true, message: "Response saved" };
};
