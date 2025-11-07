import { Skeleton } from "../ui/Skeleton";

export default function MealCalendarSkeleton() {
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const days = Array(7).fill(null); // Representing 7 days of the week

  return (
    <div className="p-3 sm:p-5 border border-gray-200 rounded-3xl h-full  ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 sm:h-7 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Week navigation and grid */}
      <div className="relative mt-6 pr-6 sm:pr-10 pt-5">
        {/* Navigation buttons */}
        <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 absolute top-5 left-2 sm:left-8 rounded-full" />
        <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 absolute top-5 right-0 sm:right-2 rounded-full" />

        <div className="flex gap-1 sm:gap-2 overflow-x-auto w-[234px] sm:w-[270px] md:w-[500px]">
          <div className="flex-1 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[500px]">
              {days.map((_, dayIndex) => (
                <div key={dayIndex} className="flex flex-col items-center gap-2 lg:w-[55px]">
                  {/* Day header */}
                  <Skeleton className="h-6 w-16 rounded-full" />

                  {/* Meal slots */}
                  <div className="flex w-full flex-col items-center gap-2">
                    {mealTypes.map((_, mealIndex) => (
                      <Skeleton
                        key={mealIndex}
                        className="h-12 w-12 md:h-14 md:w-14 rounded-full border-2"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
