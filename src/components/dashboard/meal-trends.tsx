"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  eachWeekOfInterval,
  endOfWeek
} from 'date-fns';
import { useStore } from "@/lib/store";
import { TrendView } from "@/lib/types";

// Types
interface ChartDataPoint {
  name: string;
  meals: number;
  expense: number;
}

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: any[];
//   label?: string;
//   viewType: 'daily' | 'weekly';
// }

// Constants
const CHART_COLORS = {
  meals: "#f59e0b",
  expense: "#10b981"
} as const;

const CHART_CONFIG = {
  daily: {
    barSize: undefined,
    yAxisDomain: [0, 'dataMax + 2'] as [number, string]
  },
  weekly: {
    barSize: 38,
    yAxisDomain: [0, 12] as [number, number]
  }
} as const;

// Custom Tooltip Component
// const CustomTooltip = ({ active, payload, label, viewType }: CustomTooltipProps) => {
//   if (!active || !payload || !payload.length) return null;

//   const labelText = viewType === 'daily' ? 'Date' : 'Week';

//   return (
//     <div className="rounded-lg border bg-background p-2 shadow-sm">
//       <div className="grid grid-cols-2 gap-2">
//         <div className="flex flex-col">
//           <span className="text-[0.70rem] uppercase text-muted-foreground">
//             {labelText}
//           </span>
//           <span className="font-bold text-muted-foreground">
//             {label}
//           </span>
//         </div>
//         <div className="flex flex-col">
//           <span className="text-[0.70rem] uppercase text-muted-foreground">
//             Meals
//           </span>
//           <span className="font-bold">
//             {payload[0].value}
//           </span>
//         </div>
//         <div className="flex flex-col">
//           <span className="text-[0.70rem] uppercase text-muted-foreground">
//             Expense
//           </span>
//           <span className="font-bold">
//             ₹{payload[1].value}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// Chart Component
const MealTrendsChart = ({ data, viewType }: { data: ChartDataPoint[]; viewType: TrendView }) => {
  const config = CHART_CONFIG[viewType];

  return (
    <div className={viewType === 'daily' ? 'lg:h-[300px] h-[170px]' : 'h-[300px]'}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            domain={config.yAxisDomain}
            tickCount={viewType === 'weekly' ? 7 : 4}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;

              const labelText = viewType === 'daily' ? 'Date' : 'Week';


              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {labelText}
                      </span>
                      <span className="font-bold text-muted-foreground">{label}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Meals
                      </span>
                      <span className="font-bold">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Expense
                      </span>
                      <span className="font-bold">₹{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />

          <Bar
            dataKey="meals"
            yAxisId="left"
            fill={CHART_COLORS.meals}
            radius={[10, 10, 10, 10]}
            barSize={config.barSize}
          />
          <Line
            type="monotone"
            dataKey="expense"
            yAxisId="right"
            stroke={CHART_COLORS.expense}
            strokeWidth={2}
            dot={viewType === 'weekly' ? { r: 4 } : false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// View Toggle Component
const ViewToggle = ({
  trendView,
  onViewChange
}: {
  trendView: TrendView;
  onViewChange: (view: TrendView) => void;
}) => (
  <div className="hidden md:block">
    <div className="flex justify-center items-center dark:gap-1">
      <button
        onClick={() => onViewChange('daily')}
        className={`p-1 px-2 py-1 rounded-full duration-500 ${trendView === "daily"
          ? "bg-white text-black shadow dark:bg-zinc-700 dark:shadow-md dark:text-white"
          : "bg-[#f2f2f2]  dark:bg-transparent"
          }`}
      >
        Daily
      </button>
      <button
        onClick={() => onViewChange('weekly')}
        className={`p-1 px-2 py-1 rounded-full duration-500 ${trendView === "weekly"
          ? "bg-white text-black shadow dark:bg-zinc-700 dark:shadow-md dark:text-white"
          : "bg-[#f2f2f2] dark:bg-transparent "
          }`}
      >
        Weekly
      </button>
    </div>
  </div>
);

// Navigation Controls Component
const NavigationControls = ({
  onMonthChange
}: {
  onMonthChange: (direction: 'prev' | 'next') => void;
}) => (
  <div className="flex justify-center items-center gap-3">
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => onMonthChange('prev')}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => onMonthChange('next')}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

// Main Component
export default function MealTrends() {
  const [trendView, setTrendView] = useState<TrendView>('daily');

  const currentMonth = useStore((state) => state.currentMonth);
  const setCurrentMonth = useStore((state) => state.setCurrentMonth);
  const { mealLogs } = useStore();

  const formattedMonth = format(currentMonth, 'MMMM yyyy');

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev'
      ? subMonths(currentMonth, 1)
      : addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const mealTrendsData = useMemo(() => {
    const logsThisMonth = mealLogs.filter(log =>
      isSameMonth(parseISO(log.date), currentMonth)
    );

    if (trendView === 'daily') {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      return days.map(day => {
        const logsForDay = logsThisMonth.filter(log =>
          isSameDay(parseISO(log.date), day)
        );
        const meals = logsForDay.length;
        const expense = logsForDay.reduce((sum, log) => sum + log.price, 0);

        return {
          name: format(day, 'd'),
          meals,
          expense
        };
      });
    } else {
      // Weekly view
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const weeks = eachWeekOfInterval(
        { start: monthStart, end: monthEnd },
        { weekStartsOn: 1 }
      );

      return weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const logsForWeek = logsThisMonth.filter(log => {
          const logDate = parseISO(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        });
        const meals = logsForWeek.length;
        const expense = logsForWeek.reduce((sum, log) => sum + log.price, 0);

        return {
          name: `Week ${index + 1}`,
          meals,
          expense
        };
      });
    }
  }, [mealLogs, currentMonth, trendView]);

  return (
    <div className="col-span-4 md:border md:border-gray-200 bg-[#FBFBFB] dark:bg-zinc-900 dark:border-none rounded-3xl p-5">
      <div className="flex md:flex-row justify-between md:items-center">
        <div>
          <h1 className="md:text-2xl text-lg font-bold tracking-tight ">
            Meal Trends
          </h1>
          <p className="md:text-sm text-xs tracking-tight text-[#8C97A9]">
            {formattedMonth}
          </p>
        </div>

        <div className="mb-4 flex justify-start items-center gap-2 p-2 bg-[#f2f2f2] dark:md:bg-zinc-900 dark:shadow-md w-fit rounded-full">
          <ViewToggle
            trendView={trendView}
            onViewChange={setTrendView}
          />
          <NavigationControls onMonthChange={handleMonthChange} />
        </div>
      </div>

      <div className="mt-5">
        <MealTrendsChart
          data={mealTrendsData}
          viewType={trendView}
        />
      </div>
    </div>
  );
}
