"use client";

import { handleSignInAction } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import styles from "./styles.module.css";

const formSchema = z.object({
  terms_service: z.literal(true),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    <main className={styles.main}>
      <h2 className={styles.heading}>Sign up for free</h2>
      <div className={styles.card}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <Controller
              name="terms_service"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
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
          <div className={styles.card__btnWrapper}>
            <Button
              className={cn(styles.card__btn, styles["card__btn--google"])}
              onClick={() => handleSignUp("google")}
            >
              <Image
                src="/google-logo.svg"
                alt="google-logo"
                width={24}
                height={24}
                className={styles.card__btnIcon}
              />
              <span>Sign up with Google</span>
            </Button>
            <Button
              className={cn(styles.card__btn, styles["card__btn--github"])}
              onClick={() => handleSignUp("github")}
            >
              <Image
                src="/github-mark-white-logo.svg"
                alt="github-logo"
                width={24}
                height={24}
                className={styles.card__btnIcon}
              />
              <span>Sign up with Github</span>
            </Button>
          </div>
        </form>
        <p className={styles.card__footer}>
          Already have an account?{" "}
          <Link href="sign-in">
            <Button variant="link" className={styles.card__footerBtn}>
              Sign in
            </Button>
          </Link>
        </p>
      </div>
    </main>
  );
}
