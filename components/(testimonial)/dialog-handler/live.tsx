"use client";

import { sendOtp, submitResponse } from "@/actions/testimonial";
import { Button } from "@/components/ui/button";
import { safeCall } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { Send } from "lucide-react";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import OtpDialog, { OtpForm } from "../otp-dialog";
import TestimonialDialog, { TestimonialDialogRef } from "../testimonial-dialog";
import ThankYouDialogLive from "../thank-you-dialog/live";
import styles from "./live-styles.module.css";

interface DialogHandlerLiveProps {
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true;
        };
      };
      spaceThankYouScreens: true;
      spaceExtraSettings: true;
    };
  }>;
}
export default function DialogHandlerLive({ space }: DialogHandlerLiveProps) {
  const [activeDialog, setActiveDialog] = useState<
    "testimonial" | "otp" | "thank-you" | null
  >(null);
  const [formResponse, setFormResponse] = useState<Record<
    string,
    unknown
  > | null>(null);

  const testimonialDialogRef = useRef<TestimonialDialogRef>(null);

  const { spaceThankYouScreens, spaceExtraSettings } = space;

  const router = useRouter();

  const executeThankYouAction = () => {
    // decide what to do on thank you
    if (
      spaceThankYouScreens?.type === "redirect" &&
      spaceThankYouScreens.redirect_url
    )
      router.push(spaceThankYouScreens.redirect_url);
    else setActiveDialog("thank-you");

    // clear form
    testimonialDialogRef.current?.clearForm();
  };
  const handleTestimonialSubmit = async (data: Record<string, unknown>) => {
    // check if email verification is enabled
    if (spaceExtraSettings?.verify_submitted_email) {
      setFormResponse(data); // store form data temporarily
      const { ok, message } = await safeCall(sendOtp(data["email"] as string));
      if (!ok) {
        toast.error(message, { position: "bottom-center" });
        return;
      }
      toast.success(message, { position: "bottom-center" });
      setActiveDialog("otp");
    } else {
      const fd = new FormData();
      const { photo, ...rest } = data;
      if (space.spaceBasics?.photo_field_mode !== "hidden")
        fd.append("photo", photo as File);

      fd.append("json", JSON.stringify(rest));

      const { ok, message } = await safeCall(
        submitResponse({
          spaceId: space.id,
          fd,
        }),
      );
      if (!ok) {
        toast.error(message, { position: "bottom-center" });
        return;
      }

      executeThankYouAction();
    }
  };
  const handleOtpSubmit = async ({ otp }: OtpForm) => {
    if (!formResponse) return;

    const fd = new FormData();
    const { photo, ...rest } = formResponse;
    if (space.spaceBasics?.photo_field_mode !== "hidden")
      fd.append("photo", photo as File);
    fd.append("json", JSON.stringify(rest));

    const { ok, message } = await safeCall(
      submitResponse({ spaceId: space.id, fd, otp }),
    );
    if (!ok) {
      toast.error(message, { position: "bottom-center" });
      return;
    }

    executeThankYouAction();
  };

  return (
    <>
      <Button
        className={styles.btn}
        onClick={() => setActiveDialog("testimonial")}
      >
        <span>{spaceExtraSettings?.send_button_text || "Send"}</span>
        <Send className={styles.btn__icon} />
      </Button>

      <TestimonialDialog
        ref={testimonialDialogRef}
        space={space}
        open={activeDialog === "testimonial"}
        handleOpenChange={(open) =>
          setActiveDialog(open ? "testimonial" : null)
        }
        onSubmit={handleTestimonialSubmit}
      />
      <OtpDialog
        open={activeDialog === "otp"}
        onSubmit={handleOtpSubmit}
        handleBack={() => setActiveDialog("testimonial")}
      />
      {spaceThankYouScreens && (
        <ThankYouDialogLive
          spaceThankYouScreen={spaceThankYouScreens}
          open={activeDialog === "thank-you"}
          handleOpenChange={(open) =>
            setActiveDialog(open ? "thank-you" : null)
          }
        />
      )}
    </>
  );
}
