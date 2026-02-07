import { TextShimmer } from "@/components/ui/text-shimmer";

export default function PreviewEmbedWallLoading() {
  return (
    <TextShimmer className="fixed top-1/2 left-1/2 -translate-1/2 font-mono text-nowrap sm:text-lg">
      Preparing preview...
    </TextShimmer>
  );
}
