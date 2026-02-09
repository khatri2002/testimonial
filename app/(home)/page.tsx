import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "./_components/cta-button";
import EmbedCode from "./_components/embed-code";
import EmbedWall from "./_components/embed-wall";
import { SectionDescription, SectionTitle } from "./_components/section-text";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 lg:gap-10">
        <div className="relative h-10 w-42 sm:w-50 lg:w-56">
          <Image src="testimonial-dark_theme-logo.svg" alt="testimonial" fill />
        </div>
        <SectionTitle>
          Get testimonials from your customers with ease
        </SectionTitle>
        <SectionDescription>
          Collecting testimonials is hard, we get it! So we built Testimonial.
          In minutes, you can collect testimonials from your customers with no
          need for a developer.
        </SectionDescription>
        <CTAButton href="/sign-up">Get started</CTAButton>
      </div>

      <div className="flex flex-col items-center gap-10 border-t border-b p-4 py-10 sm:py-16">
        <SectionTitle>
          Add testimonials to your website with no coding!
        </SectionTitle>
        <SectionDescription>
          Copy and paste our HTML code to add the Wall Of Testimonials to your
          website.
        </SectionDescription>
        <div className="w-full sm:px-16">
          <EmbedWall />
        </div>
        <EmbedCode />
      </div>

      <div className="flex flex-col items-center space-y-6 py-10 md:py-16 lg:space-y-8">
        <h2 className="max-w-3xl text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          Ready to collect testimonials?
        </h2>
        <CTAButton href="/sign-up">Get started</CTAButton>
      </div>

      <div className="border-t py-10">
        <span className="flex items-center justify-center gap-2 text-center font-mono text-sm text-nowrap">
          Made with <Heart className="size-5" fill="red" strokeWidth={0} /> by
          <Link
            className="hover:text-muted-foreground underline transition-colors"
            href="https://github.com/khatri2002"
            target="_blank"
          >
            Jay
          </Link>
        </span>
      </div>
    </>
  );
}
