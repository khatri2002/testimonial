import { prisma } from "@/prisma";

export default async function Home() {
  const spaces = await prisma.space.findMany();

  return spaces.length === 0
    ? "no space found"
    : `${spaces.length} space found`;
}
