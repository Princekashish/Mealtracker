"use client";

import {
  ArrowUp,
  Calendar,
} from "lucide-react";
import { HiOutlineUsers } from "react-icons/hi2";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaUtensils } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { isSameMonth, parseISO, endOfMonth, differenceInDays, format, } from "date-fns";
import Link from "next/link";
import gsap from "gsap";

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
  link?: string;
};

export default function MealMetrics() {
  const [error, setError] = useState<string | null>(null);
  const mealLogs = useStore((state) => state.mealLogs)
  const currentMonth = useStore((state) => state.currentMonth)
  const vendors = useStore((state) => state.vendors)
  const currentMonthName = format(new Date(), 'MMMM');
  const currentDayName = format(new Date(), 'dd');

  // selected index for mobile (default 0 => Expenses)
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // animated numeric value state (kept as number)
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const animRef = useRef<{ val: number }>({ val: 0 });

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

  // ensure we kill any tweens on unmount
  useEffect(() => {
    return () => {
      gsap.killTweensOf(animRef.current);
    };
  }, []);

  const monthlySummary = useMemo(() => {

    const logsThisMonth = mealLogs.filter(log => isSameMonth(parseISO(log.date), currentMonth));
    const totalCost = logsThisMonth.reduce((acc, log) => acc + (Number(log.price) * log.quantity), 0);
    const totalMeals = logsThisMonth.reduce((acc, log) => acc + log.quantity, 0);

    // Calculate remaining meals
    const today = new Date();
    const endOfCurrentMonth = endOfMonth(currentMonth);

    // Only calculate remaining meals if we're viewing the current month
    const isCurrentMonth = isSameMonth(currentMonth, new Date());
    const daysRemaining = isCurrentMonth ? differenceInDays(endOfCurrentMonth, today) + 1 : 0; // +1 to include today

    // Get active vendors and their meal offerings
    const activeVendors = vendors.filter(v => v.status === 'active');
    const totalMealsPerDay = activeVendors.reduce((total, vendor) => {
      if (!vendor.meals) return total;

      const offeredMeals = vendor.meals.filter(m => m.offered).length;
      return total + offeredMeals;
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

    const mealsAlreadyLogged = remainingDaysLogs.reduce((acc, log) => acc + log.quantity, 0);
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
      short: "Tiffins taken",
      link: "/dashboard/meals"
    },
    {
      title: "Active Vendors",
      value: monthlySummary.activeVendors.toString(),
      icon: "HiOutlineUsers",
      trend: "up",
      change: "+2 from last month",
      description: "Antu anty",
      short: "Vendors",
      link: "/dashboard/vendors"
    },

  ], [monthlySummary]);

  const Mobilemetrics = useMemo(() => [
    {
      title: "Expenses",
      value: `${monthlySummary.totalCost.toString()}`,
      icon: "FcMoneyTransfer",
      trend: "up",
      change: "+8% from last month",
      currentDay: currentDayName,
      currentMonth: currentMonthName,
      short: "pay"
    },
    {
      title: "Meals",
      value: monthlySummary.totalMeals.toString(),
      icon: "FaUtensils",
      trend: "up",
      change: "+12% from last month",
      description: "Lunch",
      short: "Tiffins taken",
      link: "/dashboard/meals"
    },
    {
      title: "Vendors",
      value: monthlySummary.activeVendors.toString(),
      icon: "HiOutlineUsers",
      trend: "up",
      change: "+2 from last month",
      description: "Antu anty",
      short: "Vendors",
      link: "/dashboard/vendors"
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
          p-5 rounded-3xl md:border md:border-gray-200 
          ${index === 0 ? "bg-[#ECEFF4]  md:bg-white " : ""}
          ${index === 1 ? "bg-[#F3F4EC]  md:bg-white " : ""}
          ${index === 2 ? "bg-[#EDF4EF]  md:bg-white " : ""}
          ${index === 3 ? "bg-[#F4ECF3]  md:hidden" : ""}
        `}>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2 gap-5 h-[60px] lg:h-[60px]">
          <div className="text-lg font-medium tracking-tight flex-wrap hidden md:block text-gray-800 ">{metric.title}</div>

          <div className="md:bg-[#F2F2F2] md:px-2 md:py-2 md:rounded-full">
            <IconComponent size={20} className="h-7 w-7 text-gray-800 " />
          </div>
        </div>
        <div className="">
          <div className="flex flex-col justify-center items-start gap-1">
            <p className={`text-sm  text-[#67686A] font-medium  md:font-medium md:hidden  tracking-tight flex-wrap dark:font-semibold`}>{metric.title}</p>
            <h1 className="md:text-[3em] text-[1.6em] font-bold text-black  flex items-center gap-2">
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

  // start animation from current animatedValue to target (number)
  const startNumberAnimation = (toNumber: number) => {
    gsap.killTweensOf(animRef.current);
    const from = animRef.current.val ?? animatedValue ?? 0;
    animRef.current.val = from;
    gsap.to(animRef.current, {
      val: toNumber,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        setAnimatedValue(animRef.current.val);
      },
    });
  };

  // when selectedIndex changes animate the displayed number
  useEffect(() => {
    const targetRaw = Number(Mobilemetrics[selectedIndex]?.value ?? 0);
    // For expenses we want one decimal place in display; keep numeric value precise for animation
    const targetForAnimation = Mobilemetrics[selectedIndex]?.title === "Expenses"
      ? Number((targetRaw / 1).toFixed(1)) // keep decimal (e.g., 1.0)
      : Math.round(targetRaw);
    startNumberAnimation(targetForAnimation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, Mobilemetrics]);

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
    <>
      <div className="w-full transition-colors duration-300 hidden md:block">
        <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {metrics.map((metric, index) => (
            metric.link ? (
              <Link href={metric.link} key={index}>
                <MetricCard key={index} metric={metric} index={index} />
              </Link>
            ) : (
              <MetricCard key={index} metric={metric} index={index} />
            )
          ))}
        </div>
      </div>

      <div className="sm:hidden w-full flex flex-col items-center justify-center font-Grift px-4 py-4">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-[5em] font-extrabold flex justify-center items-center gap-1">
            {Mobilemetrics[selectedIndex]?.title === "Expenses" ? (() => {
              const value = Number(animatedValue).toFixed(1);
              const [intPart, decimalPart] = value.split(".");
              return (
                <>
                  <span className="text-[0.6em] align-top">₹</span>
                  {intPart}
                  <span className="opacity-30">.{decimalPart}</span>
                </>
              );
            })() : (
              `${Math.round(animatedValue).toLocaleString()}`
            )}
          </h1>


        </div>

        <div className="w-full mt-4 flex items-center justify-start gap-3">
          {Mobilemetrics.map((items, index) => {
            const Icon = getIcon(items.icon);
            const isSelected = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-3 transition-opacity ${isSelected ? 'px-4 py-2 rounded-full bg-gray-200 opacity-100' : 'p-2 rounded-full bg-transparent opacity-60'}`}
              >
                <div className={`${isSelected ? 'w-10 h-10 rounded-full flex items-center justify-center bg-white' : 'w-10 h-10 rounded-full flex items-center justify-center bg-gray-100'}`}>
                  {Icon ? <Icon size={20} /> : null}
                </div>

                {/* title only visible for selected */}
                {isSelected && <span className="text-sm font-medium">{items.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </>

  );
}
