-- CreateEnum
CREATE TYPE "PhotoFieldMode" AS ENUM ('required', 'optional', 'hidden');

-- CreateEnum
CREATE TYPE "FieldsType" AS ENUM ('string', 'email');

-- CreateEnum
CREATE TYPE "ThankYouScreenType" AS ENUM ('display', 'redirect');

-- CreateEnum
CREATE TYPE "ConsentFieldMode" AS ENUM ('required', 'optional', 'hidden');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('dark', 'light');

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_basic" (
    "id" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "image_src" JSONB NOT NULL,
    "image_metadata" JSONB NOT NULL,
    "collect_star_ratings" BOOLEAN NOT NULL DEFAULT true,
    "photo_field_mode" "PhotoFieldMode" NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Space_basic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_basic_extra_fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldsType" NOT NULL DEFAULT 'string',
    "required" BOOLEAN NOT NULL,
    "space_basicId" TEXT NOT NULL,

    CONSTRAINT "Space_basic_extra_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_prompt" (
    "id" TEXT NOT NULL,
    "questions_label" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Space_prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_prompt_question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "space_promptId" TEXT NOT NULL,

    CONSTRAINT "Space_prompt_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_thank_you_screen" (
    "id" TEXT NOT NULL,
    "type" "ThankYouScreenType" NOT NULL,
    "image_src" JSONB,
    "image_metadata" JSONB,
    "title" TEXT,
    "message" TEXT,
    "redirect_url" TEXT,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Space_thank_you_screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space_extra_setting" (
    "id" TEXT NOT NULL,
    "send_button_text" TEXT NOT NULL DEFAULT 'Send',
    "max_testimonial_chars" INTEGER,
    "consent_field_mode" "ConsentFieldMode" NOT NULL DEFAULT 'required',
    "consent_text" TEXT NOT NULL DEFAULT 'I give permission to use this testimonial across social channels and other marketing efforts',
    "verify_submitted_email" BOOLEAN NOT NULL DEFAULT false,
    "theme" "Theme" NOT NULL DEFAULT 'dark',
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Space_extra_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_basic_spaceId_key" ON "Space_basic"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_prompt_spaceId_key" ON "Space_prompt"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_thank_you_screen_spaceId_key" ON "Space_thank_you_screen"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_extra_setting_spaceId_key" ON "Space_extra_setting"("spaceId");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_basic" ADD CONSTRAINT "Space_basic_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_basic_extra_fields" ADD CONSTRAINT "Space_basic_extra_fields_space_basicId_fkey" FOREIGN KEY ("space_basicId") REFERENCES "Space_basic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_prompt" ADD CONSTRAINT "Space_prompt_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_prompt_question" ADD CONSTRAINT "Space_prompt_question_space_promptId_fkey" FOREIGN KEY ("space_promptId") REFERENCES "Space_prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_thank_you_screen" ADD CONSTRAINT "Space_thank_you_screen_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_extra_setting" ADD CONSTRAINT "Space_extra_setting_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
