/*
  Warnings:

  - A unique constraint covering the columns `[embedWallId,responseId]` on the table `EmbedWallResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmbedWallResponse_embedWallId_responseId_key" ON "EmbedWallResponse"("embedWallId", "responseId");
