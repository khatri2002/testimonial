-- CreateEnum
CREATE TYPE "BorderRadius" AS ENUM ('none', 'sm', 'md', 'lg', 'xl');

-- CreateTable
CREATE TABLE "EmbedWall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hide_date" BOOLEAN NOT NULL DEFAULT true,
    "hide_title" BOOLEAN NOT NULL,
    "hide_company" BOOLEAN NOT NULL,
    "hide_star_rating" BOOLEAN NOT NULL,
    "theme" "Theme" NOT NULL DEFAULT 'dark',
    "card_gap" INTEGER NOT NULL DEFAULT 16,
    "card_bg_color" TEXT NOT NULL DEFAULT '#171717',
    "text_primary_color" TEXT NOT NULL DEFAULT '#fafafa',
    "text_secondary_color" TEXT NOT NULL DEFAULT '#a1a1a1',
    "hide_border" BOOLEAN NOT NULL DEFAULT false,
    "border_radius" "BorderRadius" NOT NULL DEFAULT 'md',
    "border_thickness" INTEGER NOT NULL DEFAULT 1,
    "border_color" TEXT NOT NULL DEFAULT '#ffffff1a',
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "EmbedWall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmbedWallToResponse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmbedWallToResponse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmbedWallToResponse_B_index" ON "_EmbedWallToResponse"("B");

-- AddForeignKey
ALTER TABLE "EmbedWall" ADD CONSTRAINT "EmbedWall_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmbedWallToResponse" ADD CONSTRAINT "_EmbedWallToResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "EmbedWall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmbedWallToResponse" ADD CONSTRAINT "_EmbedWallToResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
