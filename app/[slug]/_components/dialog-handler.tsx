"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import FormDialog from "./form-dialog";
import OtpDialog from "./otp-dialog";
import { ThankYouDialog } from "./thank-you-dialog";

export default function DialogHandler() {
  const [activeDialog, setActiveDialog] = useState<
    "form" | "otp" | "thank-you" | null
  >(null);

  return (
    <>
      <Button
        className="bg-theme-primary hover:bg-theme-primary/85 active:outline-theme-primary/50 mt-20 h-11 w-26 text-lg font-semibold outline-1 outline-offset-3 outline-transparent outline-solid active:translate-y-0.5"
        onClick={() => setActiveDialog("form")}
      >
        Send
        <Send className="size-5" />
      </Button>
      <FormDialog
        open={activeDialog === "form"}
        handleOpenChange={(open) => setActiveDialog(open ? "form" : null)}
        onSubmit={async (data) => {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(data);
              console.log(data);
              setActiveDialog("otp");
            }, 3000);
          });
        }}
      />
      <OtpDialog
        open={activeDialog === "otp"}
        handleOpenChange={(open) => setActiveDialog(open ? "otp" : null)}
        handleBack={() => setActiveDialog("form")}
        onSubmit={async (data) => {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(data);
              console.log(data);
              setActiveDialog("thank-you");
            }, 3000);
          });
        }}
      />
      <ThankYouDialog
        open={activeDialog === "thank-you"}
        handleOpenChange={(open) => setActiveDialog(open ? "thank-you" : null)}
      />
    </>
  );
}
