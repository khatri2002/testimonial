import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import OverlayBlocker from "@/components/ui/overlay-blocker";
import { Spinner } from "@/components/ui/spinner";
import { OTP_LENGTH } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

interface OtpDialogProps {
  open: boolean;
  onSubmit: (data: OtpForm) => void;
  handleBack: () => void;
}

const otpForm = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(OTP_LENGTH, `OTP must be of ${OTP_LENGTH} characters`),
});
export type OtpForm = z.infer<typeof otpForm>;

export default function OtpDialog({
  open,
  onSubmit,
  handleBack,
}: OtpDialogProps) {
  const form = useForm<OtpForm>({
    resolver: zodResolver(otpForm),
    defaultValues: {
      otp: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const otp = useWatch({ control, name: "otp" });

  return (
    <Dialog open={open}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            Verify Your Email Address
          </DialogTitle>
          <DialogDescription className="mt-1 text-center">
            Please enter the OTP we&apos;ve sent to your email address{" "}
            <span className="text-foreground block">jaykhatri@gmail.com</span>
          </DialogDescription>
        </DialogHeader>

        <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="otp"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    {...field}
                    onChange={(newVal) => {
                      field.onChange(newVal);
                      if (newVal.length === OTP_LENGTH)
                        handleSubmit(onSubmit)();
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                        <InputOTPSlot key={idx} index={idx} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {fieldState.invalid && (
                  <FieldError
                    className="text-center"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-theme-primary hover:bg-theme-primary/90"
              disabled={otp.length !== OTP_LENGTH || isSubmitting}
            >
              Submit
              {isSubmitting && <Spinner />}
            </Button>
          </DialogFooter>
        </form>

        <OverlayBlocker isVisible={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
