import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignUpForm from "./_components/(sign-up-form)/SignUpForm";
import styles from "./styles.module.css";

export default function SignUp() {
  return (
    <main className={styles.main}>
      <h2 className={styles.heading}>Sign up for free</h2>
      <div className={styles.card}>
        <SignUpForm />
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
