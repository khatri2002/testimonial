-- CreateEnum
CREATE TYPE "ConsentDisplay" AS ENUM ('required', 'optional', 'hidden');

-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "collect_star_rating" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "consent_display" "ConsentDisplay" NOT NULL DEFAULT 'required',
ADD COLUMN     "consent_statement" TEXT NOT NULL DEFAULT 'I give permission to use this testimonial across social channels and other marketing efforts',
ADD COLUMN     "max_testimonial_chars" INTEGER,
ALTER COLUMN "verify_email" SET DEFAULT true;
