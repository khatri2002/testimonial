import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import EmbedWallCards from "./_components/embed-wall-cards";
import EmbedWallEmptyState from "./_components/embed-wall-empty-state";
import EmbedWallHeader from "./_components/embed-wall-header";

interface SpaceEmbededWallProps {
  params: Promise<{ slug: string }>;
}

export default async function SpaceEmbededWall({
  params,
}: SpaceEmbededWallProps) {
  const { slug } = await params;

  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/sign-in");

  const embedWalls = await prisma.embedWall.findMany({
    where: { space: { slug, user: { email } } },
  });

  return embedWalls.length === 0 ? (
    <EmbedWallEmptyState slug={slug} />
  ) : (
    <>
      <EmbedWallHeader slug={slug} />
      <EmbedWallCards embedWalls={embedWalls} slug={slug} />
    </>
  );
}
