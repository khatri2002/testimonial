import { cn } from "@/lib/utils";

interface OverlayBlockerProps {
  isVisible: boolean;
}

export default function OverlayBlocker({ isVisible }: OverlayBlockerProps) {
  return (
    <div
      className={cn("absolute w-full h-full inset-0 z-10 hidden", {
        block: isVisible,
      })}
      role="presentation"
    />
  );
}
