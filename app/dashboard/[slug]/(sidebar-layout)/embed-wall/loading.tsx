import { Spinner } from "@/components/ui/spinner";

export default function EmbedWallLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}
