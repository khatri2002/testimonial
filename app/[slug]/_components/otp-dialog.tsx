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
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronLeft, Mail } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { otpFormSchema } from "../_lib/schema";
import { OtpFormSchema } from "../_lib/schema.types";
import DialogLoadingOverlay from "./dialog-loading-overlay";

interface OtpDialogProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  handleBack: () => void;
  onSubmit: (data: OtpFormSchema) => void;
}

export default function OtpDialog({
  open,
  handleOpenChange,
  handleBack,
  onSubmit,
}: OtpDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
    shouldFocusError: false,
  });

  const otp = useWatch({ control, name: "otp" });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm! [&>button]:hidden">
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
              <span className="block">jaykhatri@gmail.com</span>
            </DialogDescription>
          </DialogHeader>

          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <Field>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={5}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
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
