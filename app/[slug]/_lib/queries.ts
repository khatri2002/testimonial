import { prisma } from "@/prisma";
import { cache } from "react";

export const getSpaceBySlug = cache(async (slug: string) => {
  return prisma.space.findUnique({
    where: { slug },
    include: {
      fields: { where: { active: true }, orderBy: { position: "asc" } },
    },
  });
});
