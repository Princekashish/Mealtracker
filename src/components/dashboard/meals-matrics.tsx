"use client";

import {
  ArrowUp,
  Calendar,
} from "lucide-react";
import { HiOutlineUsers } from "react-icons/hi2";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaUtensils } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { isSameMonth, parseISO, endOfMonth, differenceInDays, format, } from "date-fns";

type Metric = {
  title: string;
  value: string;
  icon: string;
  trend: string;
  change: string;
  currentDay?: string;
  currentMonth?: string;
  description?: string;
  short?: string;
};


export default function MealMetrics() {
  const [error, setError] = useState<string | null>(null);
  const mealLogs = useStore((state) => state.mealLogs)
  const currentMonth = useStore((state) => state.currentMonth)
  const vendors = useStore((state) => state.vendors)
  const currentMonthName = format(new Date(), 'MMMM');
  const currentDayName = format(new Date(), 'dd');


  useEffect(() => {
    async function loadMetrics() {
      try {
        setError(null);
      } catch (err) {
        console.error("Failed to load metrics:", err);
        setError("Failed to load metrics. Please try again.");
      } 
    }

    loadMetrics();
  }, []);

  const monthlySummary = useMemo(() => {

    const logsThisMonth = mealLogs.filter(log => isSameMonth(parseISO(log.date), currentMonth));
    const totalCost = logsThisMonth.reduce((acc, log) => acc + log.price, 0);
    const totalMeals = logsThisMonth.length;

    // Calculate remaining meals
    const today = new Date();
    const endOfCurrentMonth = endOfMonth(currentMonth);

    // Only calculate remaining meals if we're viewing the current month
    const isCurrentMonth = isSameMonth(currentMonth, new Date());
    const daysRemaining = isCurrentMonth ? differenceInDays(endOfCurrentMonth, today) + 1 : 0; // +1 to include today

    // Get active vendors and their meal offerings
    const activeVendors = vendors.filter(v => v.status === 'active');
    const totalMealsPerDay = activeVendors.reduce((total, vendor) => {
      let vendorMeals = 0;
      if (vendor.meals.breakfast.offered) vendorMeals++;
      if (vendor.meals.lunch.offered) vendorMeals++;
      if (vendor.meals.dinner.offered) vendorMeals++;
      return total + vendorMeals;
    }, 0);

    // Calculate total meals available for remaining days (only for current month)
    const totalMealsAvailable = isCurrentMonth ? daysRemaining * totalMealsPerDay : 0;

    // Calculate meals already logged for remaining days (only for current month)
    const remainingDaysLogs = isCurrentMonth ? mealLogs.filter(log => {
      const logDate = parseISO(log.date);
      return isSameMonth(logDate, currentMonth) &&
        logDate >= today &&
        logDate <= endOfCurrentMonth;
    }) : [];

    const mealsAlreadyLogged = remainingDaysLogs.length;
    const remainingMeals = Math.max(0, totalMealsAvailable - mealsAlreadyLogged);

    return {
      totalCost,
      totalMeals,
      averageCost: totalMeals > 0 ? totalCost / totalMeals : 0,
      activeVendors: activeVendors.length,
      remainingMeals,
      daysRemaining,
      totalMealsPerDay,
    };
  }, [mealLogs, vendors, currentMonth])

  // Create metrics array with proper data
  const metrics = useMemo(() => [
    {
      title: "Monthly Expenses",
      value: `₹${monthlySummary.totalCost.toString()}`,
      icon: "FcMoneyTransfer",
      trend: "up",
      change: "+8% from last month",
      currentDay: currentDayName,
      currentMonth: currentMonthName,
      short: "pay"
    },
    {
      title: "Total Meals",
      value: monthlySummary.totalMeals.toString(),
      icon: "FaUtensils",
      trend: "up",
      change: "+12% from last month",
      description: "Lunch",
      short: "Tiffins taken"
    },
    {
      title: "Active Vendors",
      value: monthlySummary.activeVendors.toString(),
      icon: "HiOutlineUsers",
      trend: "up",
      change: "+2 from last month",
      description: "Antu anty",
      short: "Vendors"
    },
    {
      title: "Meals Remaining",
      value: monthlySummary.remainingMeals.toString(),
      icon: "Calendar",
      trend: "up",
      change: "+2 from last month",
      description: "Antu anty",
      short: "you will get"

    },

  ], [monthlySummary]);

  // Map icon strings to actual icon components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FaUtensils":
        return FaUtensils;
      case "HiOutlineUsers":
        return HiOutlineUsers;
      case "FcMoneyTransfer":
        return FcMoneyTransfer;
      case "Calendar":
        return Calendar;
      default:
        return FaUtensils;
    }
  };

  const MetricCard = ({ metric, index }: { metric: Metric; index: number }) => {
    const IconComponent = getIcon(metric.icon);
    return (
      <div className={`
          p-5 rounded-3xl md:border md:border-gray-200 dark:border-none
          ${index === 0 ? "bg-[#ECEFF4] dark:bg-[#1C1C24] md:bg-white dark:md:bg-zinc-900" : ""}
          ${index === 1 ? "bg-[#F3F4EC] dark:bg-[#3D3F34] md:bg-white dark:md:bg-zinc-900" : ""}
          ${index === 2 ? "bg-[#EDF4EF] dark:bg-[#34413A] md:bg-white dark:md:bg-zinc-900" : ""}
          ${index === 3 ? "bg-[#F4ECF3] dark:bg-[#41353A] md:hidden" : ""}
        `}>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5 h-[60px] lg:h-[60px]">
          <div className="text-lg font-medium tracking-tight flex-wrap hidden md:block text-gray-800 dark:text-gray-100">{metric.title}</div>

          <div className="md:bg-[#F2F2F2] dark:md:bg-[#2D2D2D] md:px-2 md:py-2 md:rounded-full">
            <IconComponent size={20} className="h-7 w-7 text-gray-800 dark:text-gray-100" />
          </div>
        </div>
        <div className="">
          <div className="flex flex-col justify-center items-start gap-1">
            <p className={`text-sm  text-[#67686A] font-medium  md:font-medium md:hidden  tracking-tight flex-wrap dark:font-semibold`}>{metric.title}</p>
            <h1 className="md:text-[3em] text-[1.6em] font-bold text-black dark:text-white flex items-center gap-2">
              {metric.value} <span className="text-xs md:hidden">{metric.short}</span>
            </h1>

          </div>
        </div>
        <div className="hidden md:block">

          <div className={` flex justify-start items-center mt-5 bg-[#F2F2F2] dark:bg-black/30 rounded-full px-4 py-2`}>
            {metric.currentDay && metric.currentMonth ? (
              <p className="text-sm font-medium flex justify-center items-center gap-2  ">
                <span className="text-xl">{metric.currentDay}</span> {metric.currentMonth}
              </p>
            ) : (
              <div className="px-4 py-1">
                <p className="text-sm font-medium flex justify-center items-center gap-2">
                  <ArrowUp size={15} />
                  {metric.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="col-span-4">
        <div className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full transition-colors duration-300">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} />
        ))}
      </div>
    </div>

  );
}
