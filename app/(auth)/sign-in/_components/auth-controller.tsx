"use client";

import { signInWithCredentials } from "@/actions/auth";
import { AuthSchema } from "@/lib/schema.types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import AuthContainer from "../../_components/auth-container";

export default function AuthController() {
  const router = useRouter();
  const [isPending, startSignIn] = useTransition();

  const onSubmit = (data: AuthSchema) => {
    startSignIn(async () => {
      const { success, message } = await signInWithCredentials(data);
      if (!success) {
        toast.error(message);
        return;
      }
      router.push("/dashboard");
    });
  };

  return (
    <AuthContainer
      buttonLabel="Sign in"
      onCredentialsSubmit={onSubmit}
      isCredentialSignInPending={isPending}
    />
  );
}
