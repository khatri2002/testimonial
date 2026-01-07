import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";
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

  const { header_title, message, theme, question_label, questions } = space;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem
      disableTransitionOnChange
    >
      <TestimonialNavbar />
      <div className="m-4 mx-auto flex max-w-150 flex-col items-center">
        <Image
          src="/placeholder.png"
          alt="testimonial"
          width={160}
          height={30}
          className="rounded"
        />
        <h1 className="mt-10 text-center text-5xl leading-14 font-bold">
          {header_title}
        </h1>
        <p className="text-muted-foreground my-8 text-center text-lg">
          {message}
        </p>
        <div className="self-start">
          <span className="before:bg-theme-primary relative before:absolute before:-bottom-3 before:h-1 before:w-1/2 before:rounded-[1px] before:content-['']">
            {question_label}
          </span>
          <ul className="text-muted-foreground mt-6 list-disc pl-4">
            {questions.map((question, index) => (
              <li key={`question-${index}`}>{question}</li>
            ))}
          </ul>
        </div>

        <DialogHandler space={space} />
      </div>
    </ThemeProvider>
  );
}
