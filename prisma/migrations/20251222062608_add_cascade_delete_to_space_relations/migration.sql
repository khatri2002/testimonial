-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space_basic_extra_fields" DROP CONSTRAINT "Space_basic_extra_fields_space_basicId_fkey";

-- DropForeignKey
ALTER TABLE "Space_extra_setting" DROP CONSTRAINT "Space_extra_setting_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space_prompt" DROP CONSTRAINT "Space_prompt_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space_prompt_question" DROP CONSTRAINT "Space_prompt_question_space_promptId_fkey";

-- DropForeignKey
ALTER TABLE "Space_thank_you_screen" DROP CONSTRAINT "Space_thank_you_screen_spaceId_fkey";

-- AddForeignKey
ALTER TABLE "Space_basic_extra_fields" ADD CONSTRAINT "Space_basic_extra_fields_space_basicId_fkey" FOREIGN KEY ("space_basicId") REFERENCES "Space_basic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_prompt" ADD CONSTRAINT "Space_prompt_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_prompt_question" ADD CONSTRAINT "Space_prompt_question_space_promptId_fkey" FOREIGN KEY ("space_promptId") REFERENCES "Space_prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_thank_you_screen" ADD CONSTRAINT "Space_thank_you_screen_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space_extra_setting" ADD CONSTRAINT "Space_extra_setting_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
