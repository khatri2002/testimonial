import CldImage from "@/components/cld-image";
import { CloudinaryImgSrc } from "@/lib/types";
import {
  Prisma,
  Space_prompt_question,
} from "@/prisma/app/generated/prisma/client";
import DialogHandlerLive from "../dialog-handler/live";
import styles from "./live-styles.module.css";

interface TestimonialPageLiveProps {
  space: Prisma.SpaceGetPayload<{
    include: {
      spaceBasics: { include: { spaceBasicExtraFields: true } };
      spacePrompts: { include: { spacePromptQuestions: true } };
      spaceThankYouScreens: true;
      spaceExtraSettings: true;
    };
  }>;
}

export default async function TestimonialPageLive({
  space,
}: TestimonialPageLiveProps) {
  const { spaceBasics, spacePrompts } = space;
  const imgSrc = spaceBasics?.image_src as CloudinaryImgSrc | undefined;

  const getQuestionsLabel = (
    questionsLabel: string | null,
    questions: Array<Space_prompt_question>,
  ) => {
    if (questionsLabel) return questionsLabel;
    return questions.length > 1 ? "QUESTIONS" : "QUESTION";
  };

  return (
    <div className={styles.container}>
      {imgSrc && (
        <CldImage
          src={imgSrc.public_id}
          width={imgSrc.width}
          height={imgSrc.height}
          sizes="100vw"
          alt="testimonial-header"
          className={styles.headerImg}
        />
      )}
      <h1 className={styles.heading}>{spaceBasics?.header}</h1>
      <p className={styles.desc}>{spaceBasics?.message}</p>
      {spacePrompts?.spacePromptQuestions &&
        spacePrompts.spacePromptQuestions.length > 0 && (
          <div className={styles.questions}>
            <h3 className={styles.questions__heading}>
              {getQuestionsLabel(
                spacePrompts.questions_label,
                spacePrompts.spacePromptQuestions,
              )}
            </h3>
            <ul className={styles.questions__list}>
              {spacePrompts?.spacePromptQuestions.map(({ id, question }) => (
                <li key={id}>{question}</li>
              ))}
            </ul>
          </div>
        )}

      <div className={styles.dialogHandlerWrapper}>
        <DialogHandlerLive space={space} />
      </div>
    </div>
  );
}
