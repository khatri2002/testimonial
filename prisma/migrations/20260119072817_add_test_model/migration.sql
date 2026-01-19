-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
