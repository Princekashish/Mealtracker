import { Skeleton } from "../ui/Skeleton";

export default function MealMetricsSkeleton() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6 md:h-[220px]">
                {Array(4).fill(0).map((_, index) => (
                    <div key={index} className={`p-5 rounded-3xl md:border md:border-gray-200 dark:border-none bg-gray-100 dark:bg-zinc-800 animate-pulse ${index == 0 ? "md:hidden" : ""}`}>
                        {/* Header row */}
                        <div className="flex justify-between items-center pb-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>

                        {/* Value */}
                        <div className="mb-2">
                            <Skeleton className="h-10 w-20 rounded" />
                            <Skeleton className="h-4 w-32 rounded mt-1" />
                        </div>

                        {/* Footer */}
                        <div>
                            <Skeleton className="h-4 w-20 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
