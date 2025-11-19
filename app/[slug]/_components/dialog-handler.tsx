"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { Send } from "lucide-react";
import { useState } from "react";
import OtpDialog from "./otp-dialog";
import TestimonialDialog from "./testimonial-dialog";
import ThankYouDialog from "./thank-you-dialog";

interface DialogHandlerProps {
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true;
        };
      };
      spaceExtraSettings: true;
    };
  }>;
}
export default function DialogHandler({ space }: DialogHandlerProps) {
  const [activeDialog, setActiveDialog] = useState<
    "testimonial" | "otp" | "thank-you" | null
  >(null);
  const { spaceExtraSettings } = space;

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
        space={space}
        open={activeDialog === "testimonial"}
        handleOpenChange={(open) =>
          setActiveDialog(open ? "testimonial" : null)
        }
        onSubmit={() =>
          new Promise((resolve) =>
            setTimeout(() => {
              setActiveDialog("otp");
              return resolve("data");
            }, 1000),
          )
        }
      />
      <OtpDialog
        open={activeDialog === "otp"}
        onSubmit={() =>
          new Promise((resolve) =>
            setTimeout(() => {
              setActiveDialog("thank-you");
              return resolve("data");
            }, 1000),
          )
        }
        handleBack={() => setActiveDialog("testimonial")}
      />
      <ThankYouDialog
        open={activeDialog === "thank-you"}
        handleOpenChange={(open) => setActiveDialog(open ? "thank-you" : null)}
      />
    </>
  );
}
