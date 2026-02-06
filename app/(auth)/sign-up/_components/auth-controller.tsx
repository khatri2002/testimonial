"use client";

import { signUp } from "@/actions/auth";
import { AuthSchema } from "@/lib/schema.types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import AuthContainer from "../../_components/auth-container";

export default function AuthController() {
  const [isPending, startSignUp] = useTransition();
  const router = useRouter();

  const onSubmit = (data: AuthSchema) => {
    startSignUp(async () => {
      const { success, message, description } = await signUp(data);
      if (!success) {
        toast.error(message, { description });
        return;
      }
      router.push("/dashboard");
    });
  };

  return (
    <AuthContainer
      buttonLabel="Sign up"
      onCredentialsSubmit={onSubmit}
      isCredentialSignInPending={isPending}
    />
  );
}
