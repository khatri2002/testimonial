import { prisma } from "@/prisma";
import { cache } from "react";

export const getSpace = cache(async (slug: string, email: string) => {
  return prisma.space.findUnique({
    where: { slug, user: { email } },
    include: {
      responses: { orderBy: { submitted_at: "desc" } },
      fields: true,
      _count: { select: { responses: true } },
    },
  });
});
