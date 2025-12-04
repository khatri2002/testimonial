"use server";

import { OTP_LENGTH } from "@/lib/constants";
import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { buildForm } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { emailSchema } from "./lib/schema";
import { OtpEmailTemplate } from "./lib/templates";
import { generateSecureOtp, replaceKeysWithLabels } from "./lib/utils";

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
    return { success: false, message: "Oops! Something went wrong." };
  }

  // send OTP email
  const res = await sendMail({
    email,
    subject: "Verify your email address",
    template: OtpEmailTemplate({ otp }),
  });
  if (!res.success)
    return { success: false, message: "Oops! Something went wrong." };

  return { success: true, message: "OTP sent" };
};

export const submitResponse = async ({
  spaceId,
  data,
  otp,
}: {
  spaceId: string;
  data: Record<string, unknown>;
  otp?: string;
}) => {
  // fetch space
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: {
      spaceBasics: { include: { spaceBasicExtraFields: true } },
      spaceExtraSettings: true,
    },
  });
  if (!space) return { success: false, message: "Space not found" };

  // validate data
  const { schema, fields } = buildForm(space);
  try {
    schema.parse(data);
  } catch (err) {
    return { success: false, message: "Invalid response" };
  }

  // verify OTP if required
  if (space.spaceExtraSettings?.verify_submitted_email) {
    if (!otp) return { success: false, message: "OTP is required" };

    try {
      const client = await getRedisClient();
      const email = data["email"];
      const savedOtp = await client.get(`otp-${email}`);
      if (otp !== savedOtp) return { success: false, message: "Invalid OTP" };

      // delete OTP after successful verification
      await client.del(`otp-${email}`);
    } catch (err) {
      return { success: false, message: "Oops! Something went wrong." };
    }
  }

  // save response
  try {
    const labeledData = replaceKeysWithLabels(
      data,
      fields,
    ) as Prisma.InputJsonValue;
    await prisma.response.create({
      data: { response: labeledData, spaceId },
    });
  } catch (err) {
    return { success: false, message: "Oops! Something went wrong." };
  }

  return { success: true, message: "Response saved" };
};

export const slugExists = async (slug: string) => {
  try {
    const exist = await prisma.space.findUnique({ where: { slug } });
    return { success: true, exist: !!exist };
  } catch (err) {
    return { success: false };
  }
};
