import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthController from "./_components/auth-controller";

export default async function SignIn() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-10">
        <Image
          src="/testimonial-mini.png"
          alt="testimonial"
          fill
          objectFit="contain"
        />
      </div>

      <div className="space-y-1 text-center">
        <h1 className="mt-4 text-xl font-semibold">Sign in to Testimonial</h1>
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground">
            Sign up
          </Link>
          .
        </p>
      </div>

      <AuthController />
    </div>
  );
}
