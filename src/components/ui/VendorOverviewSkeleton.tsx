import { Skeleton } from "../ui/Skeleton";

export default function VendorOverviewSkeleton() {
  return (
    <div className="col-span-3 p-5 rounded-3xl md:border md:border-gray-200 bg-[#FBFBFB] dark:bg-[#161616] dark:md:border-none md:bg-transparent">
      <div>
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="pt-5 space-y-4 overflow-hidden h-[140px] md:h-[124px] scrollbar-hide overflow-y-scroll">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-full mr-3" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-2" />
              </div>
              <div className="flex items-center text-xs">
                <Skeleton className="h-3 w-20" />
                <div className="mx-2">•</div>
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-10 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
