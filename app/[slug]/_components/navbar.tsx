import ThemeImage from "@/components/theme-image";
import Link from "next/link";

export default function TestimonialNavbar() {
  return (
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
  );
}
