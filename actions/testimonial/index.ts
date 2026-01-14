"use server";

import { auth } from "@/auth";
import { OTP_LENGTH } from "@/lib/config";
import { sendMail } from "@/lib/mail";
import { getRedisClient } from "@/lib/redis";
import { spaceSchema } from "@/lib/schema";
import { buildTestimonialSchema } from "@/lib/utils";
import { prisma } from "@/prisma";
import { Prisma } from "@/prisma/src/generated/prisma/client";
import { emailSchema } from "./lib/schema";
import { OtpEmailTemplate } from "./lib/templates";
import { generateSecureOtp, uploadFileToCloudinary } from "./lib/utils";

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
      const email = data.email;
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

export const isSlugAvailable = async (slug: string) => {
  try {
    const space = await prisma.space.findUnique({ where: { slug } });
    if (space) return { success: true, available: false };
    return { success: true, available: true };
  } catch (err) {
    return { success: false };
  }
};

export const createNewSpace = async (fd: FormData) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "User not found" };

  // validate data
  let data;
  try {
    const basics = JSON.parse(fd.get("basics") as string);
    const prompts = JSON.parse(fd.get("prompts") as string);
    const thank_you_screen = JSON.parse(fd.get("thank_you_screen") as string);
    const extra_settings = JSON.parse(fd.get("extra_settings") as string);
    const image = fd.get("image") ?? undefined;
    const thank_you_image = fd.get("thank_you_image") ?? undefined;
    const rawData = {
      basics: { ...basics, image },
      prompts,
      thank_you_screen: { ...thank_you_screen, thank_you_image },
      extra_settings,
    };

    const { success, data: parsedData } = spaceSchema.safeParse(rawData);
    if (!success) return { success: false, message: "Invalid data" };

    data = parsedData;
  } catch (err) {
    return { success: false, message: "Invalid data" };
  }

  // upload images if provided
  let imageRes, thankYouImageRes;
  if (data.basics.image) {
    try {
      imageRes = await uploadFileToCloudinary(data.basics.image);
    } catch (err) {
      return { success: false, message: "Failed to upload image" };
    }
  }
  if (data.thank_you_screen.thank_you_image) {
    try {
      thankYouImageRes = await uploadFileToCloudinary(
        data.thank_you_screen.thank_you_image,
      );
    } catch (err) {
      return { success: false, message: "Failed to upload image" };
    }
  }

  // create space
  const {
    basics: {
      slug,
      name,
      header_title,
      message,
      dark_mode,
      collect_star_rating,
      extra_information,
    },
    prompts: { question_label, questions },
    thank_you_screen: { thank_you_title, thank_you_message },
    extra_settings: {
      send_btn_text,
      verify_email,
      max_testimonial_chars,
      consent_display,
      consent_statement,
    },
  } = data;

  const fields: Omit<Prisma.FieldCreateWithoutSpaceInput, "position">[] = [];
  // helper to add field with position
  const addField = (
    field: Omit<Prisma.FieldCreateWithoutSpaceInput, "position">,
  ) => fields.push(field);

  // rating field
  if (collect_star_rating)
    addField({
      field_key: "rating",
      label: "Rating",
      type: "rating",
      validations: { type: "number", required: true },
      category: "core",
    });

  // testimonial field
  addField({
    field_key: "testimonial",
    label: "Testimonial",
    placeholder: "Write your testimonial here...",
    type: "textarea",
    validations: { type: "string", required: true },
    config: max_testimonial_chars
      ? {
          characterCounter: {
            enabled: true,
            enforceLimit: true,
            maxCharacters: max_testimonial_chars,
          },
        }
      : undefined,
    category: "core",
  });

  // extra information fields
  extra_information.forEach((field) => addField(field));

  // ensure email field if verify_email is true
  if (
    verify_email &&
    !extra_information.some(
      ({ field_key, active }) => field_key === "email" && active,
    )
  )
    addField({
      field_key: "email",
      label: "Email",
      type: "textbox",
      validations: { type: "email", required: true },
      config: { info: "Your email will not be shared." },
      category: "core",
      visibility: "private",
    });

  // consent field
  if (consent_display !== "hidden")
    addField({
      field_key: "consent",
      label: consent_statement || "",
      type: "checkbox",
      validations: {
        type: "boolean",
        required: consent_display === "required",
      },
      category: "core",
    });

  // add position to fields
  const fieldsWithPosition = fields.map((field, index) => ({
    ...field,
    position: index + 1,
  }));

  // save to database
  try {
    await prisma.space.create({
      data: {
        slug,
        name,
        image: imageRes,
        header_title,
        message,
        theme: dark_mode ? "dark" : "light",
        question_label,
        questions: questions.map(({ question }) => question),
        thank_you_image: thankYouImageRes,
        thank_you_title,
        thank_you_message,
        send_btn_text,
        verify_email,
        collect_star_rating,
        max_testimonial_chars: Number(max_testimonial_chars) || null,
        consent_display,
        consent_statement,
        userId: user.id,
        fields: {
          create: fieldsWithPosition,
        },
      },
    });
  } catch (err) {
    return { success: false, message: "Failed to save space" };
  }

  return { success: true, message: "Space created" };
};
