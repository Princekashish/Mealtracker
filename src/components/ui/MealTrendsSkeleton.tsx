import { Skeleton } from "@/components/ui/Skeleton";

export default function MealTrendsSkeleton() {
  return (
    <div className="col-span-4 md:border md:border-gray-200 bg-[#FBFBFB]  rounded-3xl p-5 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 md:h-8 md:w-40" />
          <Skeleton className="h-4 w-20 md:h-5 md:w-24" />
        </div>

        {/* Buttons (View toggle + navigation) */}
        <div className="flex gap-2 w-[150px] bg-[#171717]  p-2 rounded-full">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-10 rounded-full" />
          <Skeleton className="h-8 w-10 rounded-full" />
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="mt-5">
        <div className="w-full h-[170px] md:h-[300px] space-y-3">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
