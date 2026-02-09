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

  const defaultValues = {
    name: embedWall.name,
    components_visibility: {
      show_date: embedWall.show_date,
      show_title: embedWall.show_title,
      show_company: embedWall.show_company,
      show_star_rating: embedWall.show_star_rating,
    },
    themes_colors: {
      theme: embedWall.theme,
      page_bg_color: embedWall.page_bg_color,
      card_bg_color: embedWall.card_bg_color,
      text_primary_color: embedWall.text_primary_color,
      text_secondary_color: embedWall.text_secondary_color,
      border_color: embedWall.border_color,
    },
    layout_borders: {
      card_gap: embedWall.card_gap,
      border_thickness: embedWall.border_thickness,
      border_radius: embedWall.border_radius,
    },
  };

  return (
    <ClientBoundary
      id={id}
      slug={slug}
      responsesById={responsesById}
      includedIds={includedIds}
      published={embedWall.published}
      defaultValues={defaultValues}
    />
  );
}
