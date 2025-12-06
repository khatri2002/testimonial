import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useEffect } from "react";

interface LoadingProps {
  show: boolean;
}

export default function Loading({ show }: LoadingProps) {
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-black/65">
      <TextShimmer className="font-mono text-3xl" duration={1.5}>
        Creating Space...
      </TextShimmer>
    </div>
  );
}
