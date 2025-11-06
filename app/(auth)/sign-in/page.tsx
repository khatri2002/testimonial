import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import AuthButtons from "./_components/(auth-buttons)/AuthButtons";
import SignInErrorToast from "./_components/SignInErrorToast";
import styles from "./styles.module.css";

export default function SignIn() {
  return (
    <>
      <Suspense>
        <SignInErrorToast />
      </Suspense>
      <main className={styles.main}>
        <h2 className={styles.heading}>Welcome back</h2>
        <div className={styles.card}>
          <AuthButtons />
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
    </>
  );
}
