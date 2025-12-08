-- AlterTable
ALTER TABLE "Space_basic" ALTER COLUMN "image_src" DROP NOT NULL,
ALTER COLUMN "image_metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Space_extra_setting" ALTER COLUMN "send_button_text" DROP NOT NULL,
ALTER COLUMN "consent_text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Space_prompt" ALTER COLUMN "questions_label" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Space_thank_you_screen" ALTER COLUMN "image_src" DROP NOT NULL,
ALTER COLUMN "image_metadata" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;
