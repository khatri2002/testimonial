import Image from "next/image";

export default function TestimonialLoading() {
  return (
    <div className="dark bg-background flex min-h-screen items-center justify-center">
      <div className="relative h-10 w-45">
        <Image src="testimonial-dark_theme-logo.svg" alt="testimonial" fill />
      </div>
    </div>
  );
}
