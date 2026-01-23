import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
import TestimonialCards from "./_components/testimonial-cards";

interface EmbedWallProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedWall({ params }: EmbedWallProps) {
  const { id } = await params;
  const embedWall = await prisma.embedWall.findUnique({
    where: { id, published: true },
    include: { responses: true },
  });
  if (!embedWall) notFound();

  return <TestimonialCards embedWall={embedWall} />;
}
