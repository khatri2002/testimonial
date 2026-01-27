import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { notFound, redirect } from "next/navigation";
import ClientBoundary from "./client-boundary";

interface EmbedWallEditProps {
  params: Promise<{ slug: string; id: string }>;
}

export default async function EmbedWallEdit({ params }: EmbedWallEditProps) {
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

  const allResponses = await prisma.response.findMany({
    where: { spaceId: embedWall.spaceId },
  });

  const responsesById = Object.fromEntries(allResponses.map((r) => [r.id, r]));

  const includedIds = embedWall.embedWallResponses.map(
    (ewr) => ewr.response.id,
  );

  return (
    <ClientBoundary responsesById={responsesById} includedIds={includedIds} />
  );
}
