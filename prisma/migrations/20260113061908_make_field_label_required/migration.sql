/*
  Warnings:

  - Made the column `label` on table `Field` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "label" SET NOT NULL;
