import { Skeleton } from "@/components/ui/skeleton";

export default function InboxContentSkeleton() {
  return (
    <>
      <Skeleton className="h-[31px]" />
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          [...Array(2)].map((_, index) => (
            <Skeleton key={`component-${index}`} className="h-[109px]" />
          )),
        ]}
      </div>
    </>
  );
}
