import ThemeImage from "@/components/theme-image";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpaceBySlug } from "./_lib/queries";

export const dynamic = "force-dynamic";

interface TestimonialLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function TestimonialLayout({
  children,
  params,
}: TestimonialLayoutProps) {
  const { slug } = await params;

  const space = await getSpaceBySlug(slug);
  if (!space) notFound();

  const { theme } = space;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
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
