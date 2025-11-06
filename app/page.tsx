import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "./auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center">
      {session ? (
        <div className="flex flex-col gap-4 items-center">
          <span>{session.user?.name}</span>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      ) : (
        <Link href="sign-in">
          <Button>Sign in</Button>
        </Link>
      )}
    </main>
  );
}
