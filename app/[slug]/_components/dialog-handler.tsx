"use client";

import { sendOtp, submitResponse } from "@/actions/testimonial";
import { Button } from "@/components/ui/button";
import { safeCall } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { Send } from "lucide-react";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { OtpForm } from "../_lib/types.schema";
import OtpDialog from "./otp-dialog";
import TestimonialDialog, { TestimonialDialogRef } from "./testimonial-dialog";
import ThankYouDialog from "./thank-you-dialog";

interface DialogHandlerProps {
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
export default function DialogHandler({ space }: DialogHandlerProps) {
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
      const { ok, message } = await safeCall(
        submitResponse({
          spaceId: space.id,
          data,
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

    const { ok, message } = await safeCall(
      submitResponse({ spaceId: space.id, data: formResponse, otp }),
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
        className="bg-theme-primary hover:bg-theme-primary/90 p-4 sm:p-5 sm:text-lg lg:p-6"
        onClick={() => setActiveDialog("testimonial")}
      >
        <span>{spaceExtraSettings?.send_button_text}</span>
        <Send className="sm:ml-1" />
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
        <ThankYouDialog
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
