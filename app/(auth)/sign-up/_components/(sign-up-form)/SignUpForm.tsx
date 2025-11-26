"use client";

import { handleSignInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { signUpSchema } from "../../_lib/schema";
import { SignUpSchema } from "../../_lib/schema.types";
import styles from "./styles.module.css";

export default function SignUpForm() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (provider: "google" | "github") => {
    const isValid = await form.trigger();
    if (isValid) {
      toast.promise(handleSignInAction(provider), {
        error: () => {
          return {
            message: "Oops! Something went wrong.",
            description: "Please try again",
            position: "bottom-center",
          };
        },
      });
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <Controller
          name="terms_service"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="terms_service"
                aria-invalid={fieldState.invalid}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="terms_service">
                  I agree to the Testimonial Terms of Service
                </FieldLabel>
              </FieldContent>
            </Field>
          )}
        />
      </div>
      <div className={styles.btnWrapper}>
        <Button
          className={cn(styles.btn, styles["btn--google"])}
          onClick={() => handleSignUp("google")}
        >
          <Image
            src="/google-logo.svg"
            alt="google-logo"
            width={24}
            height={24}
            className={styles.btn__icon}
          />
          <span>Sign up with Google</span>
        </Button>
        <Button
          className={cn(styles.btn, styles["btn--github"])}
          onClick={() => handleSignUp("github")}
        >
          <Image
            src="/github-mark-white-logo.svg"
            alt="github-logo"
            width={24}
            height={24}
            className={styles.btn__icon}
          />
          <span>Sign up with Github</span>
        </Button>
      </div>
    </form>
  );
}
