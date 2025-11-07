import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";
import styles from "./styles.module.css";

export default function TestimonialForm() {
  return (
    <main className={styles.container}>
      <Image
        className={styles.headerImg}
        src="/placeholder.png"
        alt=""
        width={148}
        height={98}
      />
      <h1 className={styles.heading}>
        Would you like to give shoutout for XYZ?
      </h1>
      <p className={styles.desc}>
        Simple directions on how to create a perfect testimonial goes here...!
      </p>
      <div className={styles.questions}>
        <h3 className={styles.questions__heading}>Questions</h3>
        <ul className={styles.questions__list}>
          <li>Who are you / what are you working on?</li>
          <li>How has [our product / service] helped you?</li>
          <li>What is the best thing about [our product / service]</li>
        </ul>
      </div>
      <Button className={styles.btn}>
        <span>Send Testimonial</span>
        <Send className={styles.btn__icon} />
      </Button>
    </main>
  );
}
