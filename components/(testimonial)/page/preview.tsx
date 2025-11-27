import CldImage from "@/components/cld-image";
import DialogHandlerPreview from "../dialog-handler/preview";
import styles from "./styles.module.css";

interface TestimonialPagePreviewProps {
  img: {
    src: string;
    width: number;
    height: number;
  };
  header: string;
  message: string;
  questions: {
    label: string;
    list: Array<string>;
  };
  sendButtonText: string;
}

export default async function TestimonialPagePreview({
  img,
  header,
  message,
  questions,
  sendButtonText,
}: TestimonialPagePreviewProps) {
  return (
    <div className={styles.container}>
      <CldImage
        src={img.src}
        width={img.width}
        height={img.height}
        sizes="100vw"
        alt="testimonial-header"
        className={styles.headerImg}
      />
      <h1 className={styles.heading}>{header}</h1>
      <p className={styles.desc}>{message}</p>
      <div className={styles.questions}>
        <h3 className={styles.questions__heading}>{questions.label}</h3>
        <ul className={styles.questions__list}>
          {questions.list.map((question, index) => (
            <li key={`question-${index}`}>{question}</li>
          ))}
        </ul>
      </div>

      <div className={styles.dialogHandlerWrapper}>
        <DialogHandlerPreview sendButtonText={sendButtonText} />
      </div>
    </div>
  );
}
