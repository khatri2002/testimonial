import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OTP_LENGTH } from "@/lib/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronLeft, Mail } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { otpFormSchema } from "../_lib/schema";
import { OtpFormSchema } from "../_lib/schema.types";
import DialogLoadingOverlay from "./dialog-loading-overlay";

interface OtpDialogProps {
  email: string;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  handleBack: () => void;
  onSubmit: (data: OtpFormSchema) => void;
}

export default function OtpDialog({
  email,
  open,
  handleOpenChange,
  handleBack,
  onSubmit,
}: OtpDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
    shouldFocusError: false,
  });

  const otp = useWatch({ control, name: "otp" });

  // reset form when dialog is closed
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-sm! [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()} // prevent closing dialog on outside click
        onEscapeKeyDown={(e) => e.preventDefault()} // prevent closing dialog on escape key
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogLoadingOverlay isLoading={isSubmitting} />

          <DialogHeader>
            <Button variant="ghost" size="icon-sm" onClick={handleBack}>
              <ChevronLeft />
            </Button>
            <Mail className="text-theme-primary mx-auto" size={34} />
            <DialogTitle className="mt-1 text-center text-xl">
              Check your email
            </DialogTitle>
            <DialogDescription className="mt-3 text-center">
              Enter the verification code send to
              <span className="block">{email}</span>
            </DialogDescription>
          </DialogHeader>

          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <Field>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              className="bg-theme-primary hover:bg-theme-primary/85 w-full"
              disabled={otp.length !== 5}
            >
              Verify email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
