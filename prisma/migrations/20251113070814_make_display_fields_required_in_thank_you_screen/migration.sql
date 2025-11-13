/*
  Warnings:

  - Made the column `image_src` on table `Space_thank_you_screen` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_metadata` on table `Space_thank_you_screen` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Space_thank_you_screen` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `Space_thank_you_screen` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Space_thank_you_screen" ALTER COLUMN "image_src" SET NOT NULL,
ALTER COLUMN "image_src" SET DEFAULT '{ "url": "https://res.cloudinary.com/dwcjzletx/image/upload/v1762846857/samples/paper.png" }',
ALTER COLUMN "image_metadata" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'Thank you for your response!',
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "message" SET DEFAULT 'Thank you for taking your time out to submit the form. We really appreciate it.';
