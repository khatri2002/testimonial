"use server";

import { auth } from "@/app/auth";
import { OTP_LENGTH } from "@/lib/constants";
import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { createSpaceSchema } from "@/lib/schema/schema";
import { buildFormServer } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
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
  fd,
  otp,
}: {
  spaceId: string;
  fd: FormData;
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
  const { schema, fields } = buildFormServer(space);

  const json = fd.get("json");
  if (!json || typeof json !== "string")
    return { success: false, message: "Invalid response" };

  const jsonParsed = JSON.parse(json);
  const { data, success } = schema.safeParse(jsonParsed);
  if (!success) return { success: false, message: "Invalid response" };

  let photo;
  if (space.spaceBasics?.photo_field_mode !== "hidden") {
    photo = fd.get("photo") as File | null;
    if (space.spaceBasics?.photo_field_mode === "required" && !photo)
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

  // upload photo if present
  let photoSrc;
  if (photo) {
    try {
      photoSrc = await uploadFileToCloudinary(photo);
    } catch (err) {
      return { success: false, message: "Failed to upload photo" };
    }
  }

  // save response
  try {
    const labeledData = replaceKeysWithLabels(
      data,
      fields,
    ) as Prisma.InputJsonValue;
    await prisma.response.create({
      data: { response: labeledData, photo: photoSrc, spaceId },
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
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "Unauthorized" };

  // validate data
  const json = fd.get("json");
  const basicsImage = fd.get("basicsImage") as File | null;
  const thankYouImage = fd.get("thankYouImage") as File | null;

  if (!json || typeof json !== "string")
    return { success: false, message: "Invalid data" };

  const parsedData = JSON.parse(json);

  const { success, data } = createSpaceSchema.safeParse(parsedData);
  if (!success) return { success: false, message: "Invalid data" };

  // upload images
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

  // save space
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
            image_src: basicsImageSrc,
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
            redirect_url: thank_you.redirect_url,
          },
        },
        spaceExtraSettings: {
          create: {
            send_button_text: extra_settings.send_btn_text,
            max_testimonial_chars:
              extra_settings.max_testimonial_chars || undefined,
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

export const duplicateSpace = async (id: string) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      spaces: true,
    },
  });
  if (!user) return { success: false, message: "Unauthorized" };

  // check if space exists
  const exists = user.spaces.some((space) => space.id === id);
  if (!exists) return { success: false, message: "Space not found" };

  // duplicate space
  try {
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        spaceBasics: { include: { spaceBasicExtraFields: true } },
        spacePrompts: { include: { spacePromptQuestions: true } },
        spaceThankYouScreens: true,
        spaceExtraSettings: true,
      },
    });
    if (!space) return { success: false, message: "Space not found" };

    // create new slug
    const newSlug = `${space.slug}-copy-${Date.now()}`;

    await prisma.space.create({
      data: {
        name: `${space.name} (Copy)`,
        slug: newSlug,
        user: {
          connect: {
            id: user.id,
          },
        },
        spaceBasics: {
          create: {
            header: space.spaceBasics?.header || "",
            image_src: space.spaceBasics?.image_src || undefined,
            message: space.spaceBasics?.message || "",
            photo_field_mode: space.spaceBasics?.photo_field_mode || "hidden",
            collect_star_ratings:
              space.spaceBasics?.collect_star_ratings || false,
            spaceBasicExtraFields: {
              create:
                space.spaceBasics?.spaceBasicExtraFields.map((field) => ({
                  name: field.name,
                  label: field.label,
                  type: field.type,
                  required: field.required,
                })) || [],
            },
          },
        },
        spacePrompts: {
          create: {
            questions_label: space.spacePrompts?.questions_label || "",
            spacePromptQuestions: {
              create:
                space.spacePrompts?.spacePromptQuestions.map((question) => ({
                  question: question.question,
                })) || [],
            },
          },
        },
        spaceThankYouScreens: {
          create: {
            type: space.spaceThankYouScreens?.type || "display",
            title: space.spaceThankYouScreens?.title || "",
            message: space.spaceThankYouScreens?.message || "",
            image_src: space.spaceThankYouScreens?.image_src || undefined,
            redirect_url: space.spaceThankYouScreens?.redirect_url || undefined,
          },
        },
        spaceExtraSettings: {
          create: {
            send_button_text:
              space.spaceExtraSettings?.send_button_text || "Send",
            max_testimonial_chars:
              space.spaceExtraSettings?.max_testimonial_chars || null,
            consent_field_mode:
              space.spaceExtraSettings?.consent_field_mode || "hidden",
            consent_text: space.spaceExtraSettings?.consent_text || null,
            verify_submitted_email:
              space.spaceExtraSettings?.verify_submitted_email || false,
            theme: space.spaceExtraSettings?.theme || "light",
          },
        },
      },
    });
  } catch (err) {
    return { success: false, message: "Failed to duplicate space" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Space duplicated" };
};

export const deleteSpace = async (id: string) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      spaces: true,
    },
  });
  if (!user) return { success: false, message: "Unauthorized" };

  // check if space exists
  const exists = user.spaces.some((space) => space.id === id);
  if (!exists) return { success: false, message: "Space not found" };

  // delete space
  try {
    await prisma.space.delete({ where: { id } });
  } catch (err) {
    return { success: false, message: "Failed to delete space" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Space deleted" };
};

export const deleteResponse = async (id: string) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      spaces: true,
    },
  });
  if (!user) return { success: false, message: "Unauthorized" };

  // find response
  const response = await prisma.response.findFirst({
    where: { id, space: { userId: user.id } },
    select: { space: true },
  });
  if (!response) return { success: false, message: "Response not found" };

  // delete response
  try {
    await prisma.response.delete({ where: { id } });
  } catch (err) {
    return { success: false, message: "Failed to delete response" };
  }

  revalidatePath(`/dashboard/${response.space.slug}/inbox`);
  return { success: true, message: "Response deleted" };
};
