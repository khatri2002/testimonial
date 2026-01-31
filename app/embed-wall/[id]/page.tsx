import TestimonialCards from "@/components/testimonial-cards";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";

interface EmbedWallProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedWall({ params }: EmbedWallProps) {
  const { id } = await params;

  const embedWall = await prisma.embedWall.findUnique({
    where: { id, published: true },
    include: {
      embedWallResponses: {
        include: {
          response: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!embedWall) notFound();

  return <TestimonialCards embedWall={embedWall} className="min-h-screen" />;
}
