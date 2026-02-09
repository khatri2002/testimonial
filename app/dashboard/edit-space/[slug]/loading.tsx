import { TextShimmer } from "@/components/ui/text-shimmer";

export default function EditSpaceLoading() {
  return (
    <TextShimmer className="fixed top-1/2 left-1/2 -translate-1/2 font-mono text-lg">
      Getting your space ready...
    </TextShimmer>
  );
}
