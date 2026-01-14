import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "invisible fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-black/45 opacity-0 transition-all",
        { "visible opacity-100": isLoading },
      )}
    >
      <TextShimmer className="font-mono text-xl" duration={1.5}>
        Creating space...
      </TextShimmer>
    </div>
  );
}
