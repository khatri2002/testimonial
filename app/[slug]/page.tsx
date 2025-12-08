import TestimonialPageLive from "@/components/(testimonial)/page/live";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface TestimonialFormProps {
  params: Promise<{ slug: string }>;
}
export default async function TestimonialForm({
  params,
}: TestimonialFormProps) {
  const { slug } = await params;
  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true,
        },
      },
      spacePrompts: { include: { spacePromptQuestions: true } },
      spaceThankYouScreens: true,
      spaceExtraSettings: true,
    },
  });
  if (!space) notFound();

  return <TestimonialPageLive space={space} />;
}
