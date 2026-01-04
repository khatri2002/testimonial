import ThemeImage from "@/components/theme-image";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";

interface TestimonialLayoutProps {
  children: React.ReactNode;
}

export default function TestimonialLayout({
  children,
}: TestimonialLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <nav className="px-12 py-4">
        <Link href="/" className="relative block h-10 w-45">
          <ThemeImage
            darkSrc="/testimonial-dark_theme-logo.svg"
            lightSrc="/testimonial-light_theme-logo.svg"
            alt="testimonial-logo"
            fill
          />
        </Link>
      </nav>
      <main className="m-4">{children}</main>
    </ThemeProvider>
  );
}
