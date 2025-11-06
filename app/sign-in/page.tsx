"use client";

import { handleSignInAction } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import styles from "./styles.module.css";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // display error toast if there's an error query parameter
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error === "OAuthAccountNotLinked") {
      timerId = setTimeout(() => {
        toast.error("This email is already linked with another account.", {
          description: "Please use the same provider linked to this account.",
          position: "bottom-center",
          duration: Infinity,
        });
      });
    } else if (error) {
      timerId = setTimeout(() => {
        toast.error("Oops! Something went wrong.", {
          description: "Please try again",
          position: "bottom-center",
        });
      });
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

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
    <main className={styles.main}>
      <h2 className={styles.heading}>Welcome back</h2>
      <div className={styles.card}>
        <div className={styles.card__btnWrapper}>
          <Button
            className={cn(styles.card__btn, styles["card__btn--google"])}
            onClick={() => handleSignIn("google")}
          >
            <Image
              src="/google-logo.svg"
              alt="google-logo"
              width={24}
              height={24}
              className={styles.card__btnIcon}
            />
            <span>Sign in with Google</span>
          </Button>
          <Button
            className={cn(styles.card__btn, styles["card__btn--github"])}
            onClick={() => handleSignIn("github")}
          >
            <Image
              src="/github-mark-white-logo.svg"
              alt="github-logo"
              width={24}
              height={24}
              className={styles.card__btnIcon}
            />
            <span>Sign in with Github</span>
          </Button>
        </div>
        <p className={styles.card__footer}>
          Don&apos;t have an account?{" "}
          <Link href="sign-up">
            <Button variant="link" className={styles.card__footerBtn}>
              Sign up
            </Button>
          </Link>
        </p>
      </div>
    </main>
  );
}
