import { CreateSpaceSchema } from "@/app/dashboard/create-space/_lib/schema.types";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import DialogHandlerPreview from "../dialog-handler/preview";
import styles from "./preview-styles.module.css";

export default function TestimonialPagePreview() {
  const { watch } = useFormContext<CreateSpaceSchema>();
  const {
    basics: { header, message, image },
    prompts: { questions, questions_label },
    extra_settings: { send_btn_text },
  } = watch();

  const previewImage = image && URL.createObjectURL(image);

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.container}>
        {previewImage && (
          <Image
            src={previewImage}
            width={0}
            height={0}
            alt="space-image-preview"
            sizes="100vw"
            className={styles.headerImg}
          />
        )}
        <h1 className={styles.heading}>{header || "Header goes here..."}</h1>
        <p className={styles.desc}>{message || "Message goes here..."}</p>
        {questions.length > 0 && (
          <div className={styles.questions}>
            <h3 className={styles.questions__heading}>
              {questions_label
                ? questions_label
                : questions.length > 1
                  ? "QUESTIONS"
                  : "QUESTION"}
            </h3>
            <ul className={styles.questions__list}>
              {questions.map(({ question }, index) => (
                <li key={`question-${index}`}>{question}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.dialogHandlerWrapper}>
          <DialogHandlerPreview sendButtonText={send_btn_text || "Send"} />
        </div>
      </div>
    </div>
  );
}
