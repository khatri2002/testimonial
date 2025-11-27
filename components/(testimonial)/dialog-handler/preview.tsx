import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import styles from "./styles.module.css";

interface DialogHandlerPreviewProps {
  sendButtonText: string;
}
export default function DialogHandlerPreview({
  sendButtonText,
}: DialogHandlerPreviewProps) {
  return (
    <Button className={styles.btn}>
      <span>{sendButtonText}</span>
      <Send className={styles.btn__icon} />
    </Button>
  );
}
