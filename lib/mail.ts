"use server";

import { ReactNode } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
  email,
  subject,
  template,
}: {
  email: string;
  subject: string;
  template: ReactNode;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Testimonial <onboarding@resend.dev>",
      to: [email],
      subject,
      react: template,
    });

    if (error) return { success: false, message: "Failed to send email" };

    return { success: true, data };
  } catch (err) {
    return { success: false, message: "Failed to send email" };
  }
};
