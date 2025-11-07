import { Skeleton } from "../ui/Skeleton";

export default function RecentActivitySkeleton() {
  return (
    <div className="p-5 border border-gray-200 rounded-3xl ">
      <div>
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="mt-5 space-y-4 h-[315px] overflow-y-scroll scrollbar-hide">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="flex items-start">
            <Skeleton className="h-8 w-8 rounded-full mr-3 flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
