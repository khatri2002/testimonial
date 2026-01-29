/*
  Warnings:

  - You are about to drop the column `hide_company` on the `EmbedWall` table. All the data in the column will be lost.
  - You are about to drop the column `hide_date` on the `EmbedWall` table. All the data in the column will be lost.
  - You are about to drop the column `hide_star_rating` on the `EmbedWall` table. All the data in the column will be lost.
  - You are about to drop the column `hide_title` on the `EmbedWall` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmbedWall" DROP COLUMN "hide_company",
DROP COLUMN "hide_date",
DROP COLUMN "hide_star_rating",
DROP COLUMN "hide_title",
ADD COLUMN     "show_company" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_date" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_star_rating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_title" BOOLEAN NOT NULL DEFAULT false;
