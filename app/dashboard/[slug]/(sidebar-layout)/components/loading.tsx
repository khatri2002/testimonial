import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:px-8 lg:px-10 lg:py-6">
        <Skeleton className="h-7 w-46 sm:h-10" />
        <Skeleton className="h-10 w-82" />
      </div>

      <div className="flex flex-[1_1_0] overflow-hidden">
        <div className="h-full border-r p-2 sm:min-w-48 sm:p-3 md:min-w-3xs lg:min-w-xs">
          <ul className="space-y-1">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={`item-${index}`} className="h-9 min-w-10" />
            ))}
          </ul>
        </div>
        <div className="flex-[1_1_0] overflow-y-auto p-2 sm:p-3">
          <Skeleton className="h-full" />
        </div>
      </div>
    </>
  );
}
