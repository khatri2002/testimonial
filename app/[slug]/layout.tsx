import ThemeImage from "@/components/theme-image";
import { ThemeProvider } from "@/components/theme-provider";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TestimonialFormLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function TestimonialFormLayout({
  params,
  children,
}: TestimonialFormLayoutProps) {
  const { slug } = await params;
  const space = await prisma.space.findUnique({
    where: { slug },
    include: { spaceExtraSettings: true },
  });
  if (!space) notFound();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={space.spaceExtraSettings?.theme || "dark"}
      enableSystem
      disableTransitionOnChange
    >
      <nav className="py-6 px-4 sm:px-8 md:px-13">
        <Link href="/" className="block relative h-5 sm:h-7 md:h-8 w-40">
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
