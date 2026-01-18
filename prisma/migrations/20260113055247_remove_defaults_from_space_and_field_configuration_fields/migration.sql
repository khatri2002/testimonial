-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "disabled" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "verify_email" DROP DEFAULT,
ALTER COLUMN "collect_star_rating" DROP DEFAULT,
ALTER COLUMN "consent_display" DROP DEFAULT,
ALTER COLUMN "consent_statement" DROP DEFAULT;
