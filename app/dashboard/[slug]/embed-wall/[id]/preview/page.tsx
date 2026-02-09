import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { notFound, redirect } from "next/navigation";
import EmbedWallPreviewLayout from "./_components/embed-wall-preview-layout";

interface EmbedWallPreviewProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function EmbedWallPreview({
  params,
}: EmbedWallPreviewProps) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const { slug, id } = await params;
  const embedWall = await prisma.embedWall.findUnique({
    where: { id, space: { slug, user: { email } } },
    include: {
      embedWallResponses: {
        include: { response: true },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!embedWall) notFound();

  return <EmbedWallPreviewLayout embedWall={embedWall} id={id} />;
}
