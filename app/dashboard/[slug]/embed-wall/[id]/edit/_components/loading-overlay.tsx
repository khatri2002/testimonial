import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <div
      className={cn("fixed top-0 left-0 z-99 hidden h-full w-full", {
        block: isLoading,
      })}
    ></div>
  );
}
