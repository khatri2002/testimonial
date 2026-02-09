/*
  Warnings:

  - You are about to drop the `_EmbedWallToResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmbedWallToResponse" DROP CONSTRAINT "_EmbedWallToResponse_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmbedWallToResponse" DROP CONSTRAINT "_EmbedWallToResponse_B_fkey";

-- DropTable
DROP TABLE "_EmbedWallToResponse";

-- CreateTable
CREATE TABLE "EmbedWallResponse" (
    "id" TEXT NOT NULL,
    "embedWallId" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "EmbedWallResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmbedWallResponse" ADD CONSTRAINT "EmbedWallResponse_embedWallId_fkey" FOREIGN KEY ("embedWallId") REFERENCES "EmbedWall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedWallResponse" ADD CONSTRAINT "EmbedWallResponse_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
