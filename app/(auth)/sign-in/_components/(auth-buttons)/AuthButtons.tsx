"use client";

import { handleSignInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import styles from "./styles.module.css";

export default function AuthButtons() {
  const handleSignIn = async (provider: "google" | "github") => {
    toast.promise(handleSignInAction(provider), {
      error: () => {
        return {
          message: "Oops! Something went wrong.",
          description: "Please try again",
          position: "bottom-center",
        };
      },
    });
  };

  return (
    <div className={styles.container}>
      <Button
        className={cn(styles.btn, styles["btn--google"])}
        onClick={() => handleSignIn("google")}
      >
        <Image
          src="/google-logo.svg"
          alt="google-logo"
          width={24}
          height={24}
          className={styles.btn__icon}
        />
        <span>Sign in with Google</span>
      </Button>
      <Button
        className={cn(styles.btn, styles["btn--github"])}
        onClick={() => handleSignIn("github")}
      >
        <Image
          src="/github-mark-white-logo.svg"
          alt="github-logo"
          width={24}
          height={24}
          className={styles.btn__icon}
        />
        <span>Sign in with Github</span>
      </Button>
    </div>
  );
}
