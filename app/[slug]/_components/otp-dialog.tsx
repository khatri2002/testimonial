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
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { otpForm } from "../_lib/schema";
import { OtpForm } from "../_lib/types.schema";

interface OtpDialogProps {
  open: boolean;
  onSubmit: (data: OtpForm) => void;
  handleBack: () => void;
}

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
          <DialogDescription className="text-center mt-1">
            Please enter the OTP we&apos;ve sent to your email address{" "}
            <span className="block text-foreground">jaykhatri@gmail.com</span>
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
                    maxLength={4}
                    {...field}
                    onChange={(newVal) => {
                      field.onChange(newVal);
                      if (newVal.length === 4) handleSubmit(onSubmit)();
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
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
              disabled={otp.length !== 4 || isSubmitting}
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
