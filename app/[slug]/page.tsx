import prisma from "@/lib/prisma";
import Image from "next/image";
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
      spaceExtraSettings: true,
    },
  });
  if (!space) notFound();
  const { spaceBasics, spacePrompts } = space;

  return (
    <div className={styles.container}>
      <Image
        className={styles.headerImg}
        src="/placeholder.png"
        alt=""
        width={148}
        height={98}
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
