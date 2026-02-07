"use client";

import { signInWithOAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authSchema } from "@/lib/schema";
import { AuthSchema } from "@/lib/schema.types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface AuthContainerProps {
  buttonLabel: string;
  onCredentialsSubmit: (data: AuthSchema) => void;
  isCredentialSignInPending?: boolean;
}

const AUTH_ERROR_TOASTS = {
  OAuthAccountNotLinked: {
    title: "Account exists with different credentials",
    description: "Please sign in using the provider you originally used.",
  },
} as const;

export default function AuthContainer({
  buttonLabel,
  onCredentialsSubmit,
  isCredentialSignInPending,
}: AuthContainerProps) {
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isSignInWithOAuthPending, startSignInWithOAuth] = useTransition();
  const handleSignInWithOAuth = (provider: "google" | "github") => {
    startSignInWithOAuth(async () => {
      await signInWithOAuth(provider);
    });
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  useEffect(() => {
    if (!error) return;

    const toastConfig =
      AUTH_ERROR_TOASTS[error as keyof typeof AUTH_ERROR_TOASTS];
    if (!toastConfig) return;

    const id = setTimeout(() => {
      toast.error(toastConfig.title, {
        description: toastConfig.description,
      });
    }, 0);

    return () => clearTimeout(id);
  }, [error]);

  const isAuthPending = isCredentialSignInPending || isSignInWithOAuthPending;

  return (
    <>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Button
          className="bg-card hover:bg-muted text-foreground border px-8 py-5 font-semibold"
          disabled={isAuthPending}
          onClick={() => handleSignInWithOAuth("google")}
        >
          <Image
            src="/google-color.svg"
            alt="google"
            width={18}
            height={18}
            className="mr-3"
          />
          Continue with Google
        </Button>
        <Button
          className="bg-card hover:bg-muted text-foreground border px-8 py-5 font-semibold"
          disabled={isAuthPending}
          onClick={() => handleSignInWithOAuth("github")}
        >
          <Image
            src="/github.svg"
            alt="github"
            width={20}
            height={20}
            className="mr-3"
          />
          Continue with GitHub
        </Button>
      </div>

      <span className="text-muted-foreground before:bg-input after:bg-input relative my-7 w-full text-center text-sm before:absolute before:top-1/2 before:left-0 before:h-px before:w-[46%] before:-translate-y-1/2 before:content-[''] after:absolute after:top-1/2 after:right-0 after:h-px after:w-[46%] after:-translate-y-1/2 after:content-['']">
        or
      </span>

      <form
        onSubmit={form.handleSubmit(onCredentialsSubmit)}
        className="w-full"
      >
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="alan.turing@example.com"
                  disabled={isAuthPending}
                />
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup
                  aria-invalid={fieldState.invalid}
                  className={cn({ "border-destructive": fieldState.invalid })}
                >
                  <InputGroupInput
                    {...field}
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••••••"
                    disabled={isAuthPending}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="bg-transparent!"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      disabled={isAuthPending}
                    >
                      {isPasswordVisible ? <EyeOffIcon /> : <Eye />}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />
          <Button type="submit" disabled={isAuthPending}>
            {buttonLabel}
            {isCredentialSignInPending && <Spinner />}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}
