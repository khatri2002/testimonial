import Image from "next/image";
import styles from "./styles.module.css";

export default function ThankYou() {
  return (
    <div className={styles.container}>
      <div className={styles.imgWrapper}>
        <Image
          src="/placeholder.png"
          alt="thank-you"
          fill
          className={styles.img}
          sizes="(max-width: 768px) 172px, 220px"
        />
      </div>
      <h1 className={styles.heading}>Thank you for your review!</h1>
      <p className={styles.desc}>Your submission really means a ton to us!</p>
    </div>
  );
}
