import { auth } from "@/auth";
import ThemeImage from "@/components/theme-image";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserMenu from "./_components/user-menu";

interface DashboardProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: DashboardProps) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <nav className="flex items-center justify-between border-b px-12 py-4">
          <Link href="/dashboard" className="relative block h-10 w-45">
            <ThemeImage
              darkSrc="/testimonial-dark_theme-logo.svg"
              lightSrc="/testimonial-light_theme-logo.svg"
              alt="testimonial-logo"
              fill
            />
          </Link>
          <UserMenu user={session.user} />
        </nav>
        <main className="flex flex-[1_1_0] flex-col">{children}</main>
      </div>
    </ThemeProvider>
  );
}
