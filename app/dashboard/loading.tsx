import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-5 my-4 sm:mx-10 md:mx-15 lg:mx-20 xl:mx-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Spaces</h1>
        <Skeleton className="h-8 w-42" />
      </div>

      <Skeleton className="mt-5 h-8" />

      <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`item-${index}`} className="h-20" />
        ))}
      </div>
    </div>
  );
}
