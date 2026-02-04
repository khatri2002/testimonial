import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex h-22 items-center justify-between border-b px-10 py-6">
        <Skeleton className="h-full w-46" />
        <Skeleton className="h-full w-82" />
      </div>

      <div className="flex flex-[1_1_0] overflow-hidden">
        <div className="h-full w-xs border-r p-3">
          <ul className="space-y-1">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={`item-${index}`} className="h-9" />
            ))}
          </ul>
        </div>
        <div className="flex-[1_1_0] overflow-y-auto p-3">
          <Skeleton className="h-full" />
        </div>
      </div>
    </>
  );
}
