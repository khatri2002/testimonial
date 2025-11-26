import CldImage from "@/components/cld-image";
import prisma from "@/lib/prisma";
import { CloudinaryImgSrc } from "@/lib/types";
import { notFound } from "next/navigation";
import DialogHandler from "./_components/dialog-handler";
import styles from "./styles.module.css";

interface TestimonialFormProps {
  params: Promise<{ slug: string }>;
}
export default async function TestimonialForm({
  params,
}: TestimonialFormProps) {
  const { slug } = await params;
  const space = await prisma.space.findUnique({
    where: { slug },
    include: {
      spaceBasics: {
        include: {
          spaceBasicExtraFields: true,
        },
      },
      spacePrompts: { include: { spacePromptQuestions: true } },
      spaceThankYouScreens: true,
      spaceExtraSettings: true,
    },
  });
  if (!space) notFound();
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
        <DialogHandler space={space} />
      </div>
    </div>
  );
}
