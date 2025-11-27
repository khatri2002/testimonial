import ThemeImage from "@/components/theme-image";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../auth";
import LogoutMenuItem from "./_components/logout-menu-item";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");

  const { user } = session;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <nav className="sticky top-0 flex items-center justify-between border-b px-4 py-4 sm:px-8 md:px-13">
        <Link
          href="/dashboard"
          className="relative block h-5 w-40 sm:h-7 md:h-8"
        >
          <ThemeImage
            darkSrc="/testimonial-dark_theme-logo.svg"
            lightSrc="/testimonial-light_theme-logo.svg"
            alt="testimonial-logo"
            fill
          />
        </Link>

        {user?.image && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative size-9 cursor-pointer rounded-full">
                <Image
                  src={user.image}
                  alt="user"
                  fill
                  className="rounded-full"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <Link href="profile">
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>
                    <User />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              {/* client component with on click handler */}
              <LogoutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
      <main>{children}</main>
    </ThemeProvider>
  );
}
