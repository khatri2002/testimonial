"use server";

import { auth } from "@/app/auth";
import { OTP_LENGTH } from "@/lib/constants";
import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { createSpaceSchema } from "@/lib/schema/schema";
import { buildForm } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { emailSchema } from "./lib/schema";
import { OtpEmailTemplate } from "./lib/templates";
import {
  generateSecureOtp,
  mergeExtraFields,
  replaceKeysWithLabels,
  uploadFileToCloudinary,
} from "./lib/utils";

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

export const createSpace = async (fd: FormData) => {
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "Unauthorized" };

  const json = fd.get("json");
  const basicsImage = fd.get("basicsImage") as File | null;
  const thankYouImage = fd.get("thankYouImage") as File | null;

  if (!json || typeof json !== "string")
    return { success: false, message: "Invalid data" };

  const parsedData = JSON.parse(json);

  const { success, data } = createSpaceSchema.safeParse(parsedData);
  if (!success) return { success: false, message: "Invalid data" };

  let basicsImageSrc, thankYouImageSrc;
  try {
    if (basicsImage) {
      basicsImageSrc = await uploadFileToCloudinary(basicsImage);
    }
    if (thankYouImage) {
      thankYouImageSrc = await uploadFileToCloudinary(thankYouImage);
    }
  } catch (err) {
    return { success: false, message: "Failed to upload images" };
  }

  try {
    const { basics, prompts, thank_you, extra_settings } = data;
    const spaceBasicExtraFields = mergeExtraFields(
      basics.extra_fields_system,
      basics.extra_fields_user,
    );
    await prisma.space.create({
      data: {
        name: basics.name,
        slug: basics.slug,
        user: {
          connect: {
            id: user.id,
          },
        },
        spaceBasics: {
          create: {
            header: basics.header,
            image_metadata: {},
            image_src: basicsImageSrc || {},
            message: basics.message,
            photo_field_mode: basics.photo_field_mode,
            collect_star_ratings: basics.collect_star_ratings,
            spaceBasicExtraFields: {
              create: spaceBasicExtraFields,
            },
          },
        },
        spacePrompts: {
          create: {
            questions_label: prompts.questions_label,
            spacePromptQuestions: { create: prompts.questions },
          },
        },
        spaceThankYouScreens: {
          create: {
            type: thank_you.type,
            title: thank_you.title,
            message: thank_you.message,
            image_src: thankYouImageSrc,
            image_metadata: {},
            redirect_url: thank_you.redirect_url,
          },
        },
        spaceExtraSettings: {
          create: {
            send_button_text: extra_settings.send_btn_text,
            max_testimonial_chars: extra_settings.max_testimonial_chars || null,
            consent_field_mode: extra_settings.consent_field_mode,
            consent_text: extra_settings.consent_text,
            verify_submitted_email: extra_settings.verify_submitted_email,
            theme: extra_settings.theme,
          },
        },
      },
    });
  } catch (err) {
    return { success: false, message: "Failed to save space" };
  }

  return { success: true, message: "Success" };
};
