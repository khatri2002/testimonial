-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
