"use client";

import { saveResponse, sendOtp } from "@/actions/testimonial";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/prisma/src/generated/prisma/client";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import FormDialog, { FormDialogRef } from "./form-dialog";
import OtpDialog from "./otp-dialog";
import { ThankYouDialog } from "./thank-you-dialog";

interface DialogHandlerProps {
  space: Prisma.SpaceGetPayload<{ include: { fields: true } }>;
}

export default function DialogHandler({ space }: DialogHandlerProps) {
  const { id, send_btn_text, verify_email } = space;

  const [activeDialog, setActiveDialog] = useState<
    "form" | "otp" | "thank-you" | null
  >(null);

  const [formResponse, setFormResponse] = useState<Record<
    string,
    unknown
  > | null>(null);

  const formDialogRef = useRef<FormDialogRef>(null);

  const handleSaveResponse = async (otp?: string) => {
    if (!formResponse) return;

    try {
      const { success, message } = await saveResponse(id, formResponse, otp);
      if (!success) {
        toast.error("Oops! Something went wrong", { description: message });
        return;
      }
      setActiveDialog("thank-you");
      formDialogRef.current?.clearForm(); // clear form

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Oops! Something went wrong");
    }
  };

  return (
    <>
      <Button
        className="bg-theme-primary hover:bg-theme-primary/85 active:outline-theme-primary/50 h-9 font-semibold outline-1 outline-offset-3 outline-transparent outline-solid active:translate-y-0.5 sm:h-11 sm:text-lg"
        onClick={() => setActiveDialog("form")}
      >
        {send_btn_text}
        <Send className="size-4 sm:size-5" />
      </Button>
      <FormDialog
        ref={formDialogRef}
        space={space}
        open={activeDialog === "form"}
        handleOpenChange={(open) => setActiveDialog(open ? "form" : null)}
        onSubmit={async (data) => {
          setFormResponse(data);
          if (verify_email) {
            try {
              const { success, message } = await sendOtp(String(data.email));
              if (!success) {
                toast.error("Oops! Something went wrong", {
                  description: message,
                });
                return;
              }
              setActiveDialog("otp");

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
              toast.error("Oops! Something went wrong");
            }
          } else {
            await handleSaveResponse();
          }
        }}
      />
      <OtpDialog
        email={String(formResponse?.email ?? "")}
        open={activeDialog === "otp"}
        handleOpenChange={(open) => setActiveDialog(open ? "otp" : null)}
        handleBack={() => setActiveDialog("form")}
        onSubmit={(data) => handleSaveResponse(data.otp)}
      />
      <ThankYouDialog
        space={space}
        open={activeDialog === "thank-you"}
        handleOpenChange={(open) => setActiveDialog(open ? "thank-you" : null)}
      />
    </>
  );
}
