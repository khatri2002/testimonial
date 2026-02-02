import CldImage from "@/components/cld-image";
import { ThemeProvider } from "@/components/theme-provider";
import { CloudinaryImage } from "@/lib/types";
import { notFound } from "next/navigation";
import DialogHandler from "./_components/dialog-handler";
import TestimonialNavbar from "./_components/navbar";
import { getSpaceBySlug } from "./_lib/queries";

export const dynamic = "force-dynamic";

interface TestimonialPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TestimonialPage({
  params,
}: TestimonialPageProps) {
  const { slug } = await params;
  const space = await getSpaceBySlug(slug);
  if (!space) notFound();

  const {
    header_title,
    message,
    theme,
    question_label,
    questions,
    image: rawImage,
  } = space;

  const image = rawImage as CloudinaryImage | null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem
      disableTransitionOnChange
    >
      <main>
        <TestimonialNavbar />
        <div className="m-4 mx-auto flex max-w-150 flex-col items-center px-4">
          {image && (
            <CldImage
              src={image.public_id}
              width={image.width}
              height={image.height}
              alt="testimonial header image"
              loading="eager"
              sizes="100vw"
            />
          )}
          <h1 className="mt-5 text-center text-3xl leading-8 font-bold sm:mt-10 sm:text-5xl sm:leading-14">
            {header_title}
          </h1>
          <p className="text-muted-foreground my-5 text-center whitespace-pre-line sm:my-8 sm:text-lg">
            {message}
          </p>
          {questions.length > 0 && (
            <div className="self-start">
              <span className="before:bg-theme-primary relative before:absolute before:-bottom-3 before:h-1 before:w-1/2 before:rounded-[1px] before:content-['']">
                {question_label}
              </span>
              <ul className="text-muted-foreground mt-6 list-disc pl-4 text-sm sm:text-base">
                {questions.map((question, index) => (
                  <li key={`question-${index}`}>{question}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 sm:mt-20">
            <DialogHandler space={space} />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
