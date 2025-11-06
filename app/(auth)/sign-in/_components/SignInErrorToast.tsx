"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SignInErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;

    const { message, description } = getErrorMessage(error);
    const timerId = setTimeout(() => {
      toast.error(message, {
        description,
        position: "bottom-center",
      });
    });

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return null;
}

const getErrorMessage = (error: string) => {
  switch (error) {
    case "OAuthAccountNotLinked":
      return {
        message: "This email is already linked with another account.",
        description: "Please use the same provider linked to this account.",
      };

    default:
      return {
        message: "Oops! Something went wrong.",
        description: "Please try again.",
      };
  }
};
