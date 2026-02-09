-- DropForeignKey
ALTER TABLE "EmbedWallResponse" DROP CONSTRAINT "EmbedWallResponse_embedWallId_fkey";

-- DropForeignKey
ALTER TABLE "EmbedWallResponse" DROP CONSTRAINT "EmbedWallResponse_responseId_fkey";

-- AddForeignKey
ALTER TABLE "EmbedWallResponse" ADD CONSTRAINT "EmbedWallResponse_embedWallId_fkey" FOREIGN KEY ("embedWallId") REFERENCES "EmbedWall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedWallResponse" ADD CONSTRAINT "EmbedWallResponse_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
