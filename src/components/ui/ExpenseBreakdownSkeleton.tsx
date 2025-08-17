import { Skeleton } from "../ui/Skeleton";

export default function ExpenseBreakdownSkeleton() {
  return (
    <div className="col-span-3 p-5 md:border md:border-gray-200 bg-[#F5F5F5] rounded-3xl h-full dark:bg-[#161616] dark:border-none">
      <div>
        <Skeleton className="h-6 w-40 mb-1" /> {/* Title */}
        <Skeleton className="h-4 w-64" /> {/* Subtitle */}
      </div>

      <div className="grid lg:h-[200px] grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 sm:gap-8 mt-5">
        {/* Pie chart placeholder */}
        <div className="flex items-center justify-center">
          <div className="w-[150px] h-[150px] rounded-full bg-gray-300 dark:bg-zinc-700 animate-pulse" />
        </div>

        {/* Monthly stats */}
        <div className="space-y-2 text-center">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-8 w-24 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>

      {/* Download button */}
      <div className="mt-6 flex justify-center">
        <div className="w-[200px] h-[44px] rounded-full bg-gray-300 dark:bg-zinc-700 animate-pulse" />
      </div>
    </div>
  );
}
