"use server";

import { auth } from "@/auth";
import { embedWallSchema } from "@/lib/schema";
import { EmbedWallSchema } from "@/lib/schema.types";
import { prisma } from "@/prisma";

export const publishEmbedWall = async (id: string) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "User not found" };

  // update embed-wall
  try {
    await prisma.embedWall.update({
      data: { published: true },
      where: { id, space: { userId: user.id } },
    });
  } catch (err) {
    return { success: false, message: "Failed to publish" };
  }

  return { success: true, message: "Published" };
};

export const updateEmbedWallResponses = async (
  id: string,
  responseIds: string[],
) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "User not found" };

  // fetch embed-wall
  const embedWall = await prisma.embedWall.findUnique({
    where: { id, space: { userId: user.id } },
  });
  if (!embedWall) return { success: false, message: "Embed wall not found" };

  // update embed-wall responses
  try {
    await prisma.$transaction(async (tx) => {
      await tx.embedWallResponse.deleteMany({ where: { embedWallId: id } });

      if (responseIds.length > 0)
        await tx.embedWallResponse.createMany({
          data: responseIds.map((responseId, index) => ({
            embedWallId: id,
            responseId,
            order: index,
          })),
        });
    });
  } catch (err) {
    return { success: false, message: "Failed to update responses" };
  }

  return { success: true, message: "wall responses updated" };
};

export const updateEmbedWall = async (
  id: string,
  embedWallData: EmbedWallSchema,
) => {
  // authenticate user
  const session = await auth();
  if (!session?.user || !session.user.email)
    return { success: false, message: "Unauthorized" };

  // fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { success: false, message: "User not found" };

  // fetch embed-wall
  const embedWall = await prisma.embedWall.findUnique({
    where: { id, space: { userId: user.id } },
  });
  if (!embedWall) return { success: false, message: "Embed wall not found" };

  // validate data
  const { success, data } = embedWallSchema.safeParse(embedWallData);
  if (!success) return { success: false, message: "Invalid data" };

  const { name, components_visibility, themes_colors, layout_borders } = data;

  // update embed-wall
  try {
    await prisma.embedWall.update({
      data: {
        name,

        show_date: components_visibility.show_date,
        show_title: components_visibility.show_title,
        show_company: components_visibility.show_company,
        show_star_rating: components_visibility.show_star_rating,

        theme: themes_colors.theme,
        page_bg_color: themes_colors.page_bg_color,
        card_bg_color: themes_colors.card_bg_color,
        text_primary_color: themes_colors.text_primary_color,
        text_secondary_color: themes_colors.text_secondary_color,
        border_color: themes_colors.border_color,

        card_gap: layout_borders.card_gap,
        border_thickness: layout_borders.border_thickness,
        border_radius: layout_borders.border_radius,
      },
      where: { id },
    });
  } catch (err) {
    return { success: false, message: "Failed to update embed-wall" };
  }

  return { success: true, message: "Embed-wall updated" };
};
