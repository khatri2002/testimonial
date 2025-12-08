-- AlterTable
ALTER TABLE "Space_extra_setting" ALTER COLUMN "send_button_text" DROP DEFAULT,
ALTER COLUMN "consent_text" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Space_prompt" ALTER COLUMN "questions_label" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Space_thank_you_screen" ALTER COLUMN "image_src" DROP DEFAULT,
ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "message" DROP DEFAULT;
