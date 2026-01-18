import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface DialogLoadingOverlayProps {
  isLoading: boolean;
}

export default function DialogLoadingOverlay({
  isLoading,
}: DialogLoadingOverlayProps) {
  return (
    <div
      className={cn(
        "absolute z-10 flex h-full w-full items-center justify-center rounded-lg bg-black/60",
        "invisible top-0 left-0 opacity-0 transition-all duration-300",
        { "visible opacity-100": isLoading },
      )}
    >
      <Spinner className="size-5" />
    </div>
  );
}
