import ThemeImage from "@/components/theme-image";
import Link from "next/link";

interface TestimonialFormLayoutProps {
  children: React.ReactNode;
}

export default function TestimonialFormLayout({
  children,
}: TestimonialFormLayoutProps) {
  return (
    <>
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
    </>
  );
}
