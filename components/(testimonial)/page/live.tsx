import CldImage from "@/components/cld-image";
import { CloudinaryImgSrc } from "@/lib/types";
import { Prisma } from "@/prisma/app/generated/prisma/client";
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
  const imgSrc = spaceBasics?.image_src as CloudinaryImgSrc;

  return (
    <div className={styles.container}>
      <CldImage
        src={imgSrc.public_id}
        width={imgSrc.width}
        height={imgSrc.height}
        sizes="100vw"
        alt="testimonial-header"
        className={styles.headerImg}
      />
      <h1 className={styles.heading}>{spaceBasics?.header}</h1>
      <p className={styles.desc}>{spaceBasics?.message}</p>
      <div className={styles.questions}>
        <h3 className={styles.questions__heading}>
          {spacePrompts?.questions_label}
        </h3>
        <ul className={styles.questions__list}>
          {spacePrompts?.spacePromptQuestions.map(({ id, question }) => (
            <li key={id}>{question}</li>
          ))}
        </ul>
      </div>

      <div className={styles.dialogHandlerWrapper}>
        <DialogHandlerLive space={space} />
      </div>
    </div>
  );
}
