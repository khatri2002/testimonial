import { Spinner } from "@/components/ui/spinner";

export default function InboxLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  );
}
