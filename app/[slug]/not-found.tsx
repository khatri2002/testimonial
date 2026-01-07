import Image from "next/image";
import Link from "next/link";

export default function TestimonialNotFound() {
  return (
    <main className="dark bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <span className="text-7xl">404</span>
      <h2 className="mt-4 text-lg">
        Oops! The space you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Please check the link or ask the space owner to share a valid URL.
      </p>
      <Link href="/" className="absolute bottom-17 h-10 w-45">
        <Image src="testimonial-dark_theme-logo.svg" alt="testimonial" fill />
      </Link>
    </main>
  );
}
