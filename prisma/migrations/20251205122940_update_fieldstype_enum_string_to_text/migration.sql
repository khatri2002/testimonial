/*
  Warnings:

  - The values [string] on the enum `FieldsType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FieldsType_new" AS ENUM ('text', 'email');
ALTER TABLE "public"."Space_basic_extra_fields" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Space_basic_extra_fields" ALTER COLUMN "type" TYPE "FieldsType_new" USING ("type"::text::"FieldsType_new");
ALTER TYPE "FieldsType" RENAME TO "FieldsType_old";
ALTER TYPE "FieldsType_new" RENAME TO "FieldsType";
DROP TYPE "public"."FieldsType_old";
ALTER TABLE "Space_basic_extra_fields" ALTER COLUMN "type" SET DEFAULT 'text';
COMMIT;

-- AlterTable
ALTER TABLE "Space_basic_extra_fields" ALTER COLUMN "type" SET DEFAULT 'text';
