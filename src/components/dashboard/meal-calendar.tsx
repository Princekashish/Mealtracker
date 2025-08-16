
"use client";

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Utensils, Coffee, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MealType } from '@/lib/types';
import { Button } from '../ui/Button';

interface MealCalendarProps {
  onAddMeal: (date: Date) => void;
}

const MealIcon = ({ mealType }: { mealType: MealType }) => {
  switch (mealType) {
    case 'breakfast':
      return <Coffee className="h-4 w-4 text-white" />;
    case 'lunch':
      return <Sun className="h-4 w-4 text-white" />;
    case 'dinner':
      return <Moon className="h-4 w-4 text-white" />;
    default:
      return <Utensils className="h-4 w-4 text-white" />;
  }
};

export default function MealCalendar({ onAddMeal }: MealCalendarProps) {
  const { mealLogs } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const week = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // // For mobile: show only 3 days (current day and adjacent days)
  // const mobileDays = useMemo(() => {
  //   const today = new Date();
  //   const todayIndex = week.findIndex(day => isSameDay(day, today));

  //   if (todayIndex === -1) {
  //     // If today is not in current week, show first 3 days
  //     return week.slice(0, 7);
  //   }

  //   // Show today and adjacent days
  //   const start = Math.max(0, todayIndex - 2);
  //   const end = Math.min(week.length, todayIndex + 5);
  //   return week.slice(start, end);
  // }, [week]);

  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const mealTimes: MealType[] = ['breakfast', 'lunch', 'dinner'];

  const handleSlotClick = (day: Date) => {
    onAddMeal(day);
  };

  return (
    <div className='p-3 sm:p-5 border border-gray-200 rounded-3xl h-full dark:bg-zinc-900 dark:border-none'>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Meal Schedule</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className='bg-[#F2f2f2] px-3 sm:px-3 py-3 sm:py-3 rounded-full'>
              <p className="text-xs sm:text-sm tracking-tight text-black font-medium">{format(currentDate, 'MMMM yyyy')}</p>
            </div>

            <Button size="sm" className='rounded-full h-10 w-10 flex justify-center items-center sm:h-10 sm:w-10 bg-zinc-900' onClick={() => onAddMeal(new Date())}>
              <Plus className="" color='white' />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4  overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2 relative pr-6 sm:pr-10 pt-5 ">
          {/* Time column - hidden on mobile, visible on tablet and desktop */}
          <div className="hidden sm:flex flex-col justify-between gap-3 items-center lg:mt-8 lg:h-[178px] relative lg:top-2 ">
            {mealTimes.map(meal => (
              <div key={meal} className="flex h-20 items-center justify-center text-xs font-medium text-muted-foreground capitalize">
                {meal}
              </div>
            ))}
          </div>

          {/* Mobile meal times - shown only on mobile */}
          <div className="sm:hidden flex flex-col justify-between gap-2  mt-8 h-[140px] relative top-2 ">
            {mealTimes.map(meal => (
              <div key={meal} className="flex h-16 items-center justify-center text-xs font-medium text-muted-foreground capitalize">
                {meal}
              </div>
            ))}
          </div>

          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 absolute top-5 left-2 sm:left-8" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button variant="outline" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 absolute top-5 right-0 sm:right-2" onClick={goToNextWeek}>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          {/* Day columns */}
          <div className='flex gap-1 sm:gap-2 overflow-x-auto w-[234px] sm:w-[270px]   md:w-[500px] '>
            <div className="flex-1 overflow-x-auto">
              <div className="grid grid-cols-7 gap-2" style={{ minWidth: '500px' }}>
                {week.map((day) => {
                  const dayLogs = mealLogs.filter(log => isSameDay(parseISO(log.date), day));
                  return (
                    <div key={day.toString()} className="flex flex-col items-center gap-2  lg:w-[55px]">
                      <div className={cn("text-center flex justify-center items-center font-medium px-2 w-full py-1 rounded-full", isToday(day) && "bg-black text-white")}>
                        <p className="text-sm">{format(day, 'E')},</p>
                        <p className="text-sm">{format(day, 'd')}</p>
                      </div>
                      <div className="flex w-full flex-col items-center gap-2">
                        {mealTimes.map(mealType => {
                          const log = dayLogs.find(l => l.mealType === mealType);

                          return (
                            <button
                              key={mealType}
                              onClick={() => handleSlotClick(day)}
                              className={cn(
                                "group relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-2 transition-all",
                                log
                                  ? 'border-[#f2f2f2] bg-[#F59E0B] text-white'
                                  : 'border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5',
                                isToday(day) && !log && 'bg-accent/50'
                              )}
                            >
                              {log ? (
                                <div className="flex flex-col items-center gap-1 text-primary">
                                  <MealIcon mealType={mealType} />
                                </div>
                              ) : (
                                <Plus className="md:h-5 md:w-5 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



{/* <div className='flex gap-1 sm:gap-2 overflow-x-auto w-[280px]   md:w-[500px] '>
<div className="flex-1 overflow-x-auto">
  <div className="grid grid-cols-7 gap-2" style={{ minWidth: '500px' }}>
    {week.map((day) => {
      const dayLogs = mealLogs.filter(log => isSameDay(parseISO(log.date), day));
      return (
        <div key={day.toString()} className="flex flex-col items-center gap-2">
          <div className={cn("text-center", isToday(day) && "text-primary font-bold")}>
            <p className="text-xs">{format(day, 'E')}</p>
            <p className="text-lg">{format(day, 'd')}</p>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            {mealTimes.map(mealType => {
              const log = dayLogs.find(l => l.mealType === mealType);
              return (
                <button
                  key={mealType}
                  onClick={() => handleSlotClick(day)}
                  className={cn(
                    "group relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all",
                    log
                      ? 'border-[#f2f2f2] bg-[#F59E0B] text-white'
                      : 'border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5',
                    isToday(day) && !log && 'bg-accent/50'
                  )}
                >
                  {log ? (
                    <div className="flex flex-col items-center gap-1 text-primary">
                      <MealIcon mealType={mealType} />
                    </div>
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
</div>
</div> */}




{/* <button
key={mealType}
onClick={() => handleSlotClick(day)}
className={cn(
  "group relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
  log
    ? 'border-[#f2f2f2] bg-[#F59E0B] text-white'
    : 'border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5',
  isToday(day) && !log && 'bg-accent/50'
)}
>
{log ? (
  <div className="flex flex-col items-center gap-1 text-primary">
    <MealIcon mealType={mealType} />
  </div>
) : (
  <Plus className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
)}
</button> */}