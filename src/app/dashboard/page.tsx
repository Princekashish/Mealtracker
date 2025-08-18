"use client";

import dynamic from 'next/dynamic';

// Dynamic imports with SSR disabled and loading fallback
const Aianalysis = dynamic(() => import('@/components/dashboard/aianalysis'), {
  ssr: false,
  loading: () => <div className="w-full mt-5">
    <div className="">
      {Array(1).fill(0).map((_, index) => (
        <div key={index}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>,
});

const ExpenseBreakdown = dynamic(() => import('@/components/dashboard/expense-break-down'), {
  ssr: false,
  loading: () => <ExpenseBreakdownSkeleton />,
});

const MealCalendar = dynamic(() => import('@/components/dashboard/meal-calendar'), {
  ssr: false,
  loading: () => <MealCalendarSkeleton />,
});

const MealTracker = dynamic(() => import('@/components/dashboard/meal-onboarding'), {
  ssr: false,
  loading: () => <p>Loading Meal Tracker...</p>,
});

const MealTrends = dynamic(() => import('@/components/dashboard/meal-trends'), {
  ssr: false,
  loading: () => <MealTrendsSkeleton />,
});

const MealMetrics = dynamic(() => import('@/components/dashboard/meals-matrics'), {
  ssr: false,
  loading: () => <MealMetricsSkeleton />
});

const OnboardingDialog = dynamic(() => import('@/components/dashboard/on-boarding'), {
  ssr: false,
  loading: () => <p>Loading Onboarding Dialog...</p>,
});

const RecentActivity = dynamic(() => import('@/components/dashboard/recent-activity'), {
  ssr: false,
  loading: () => <RecentActivitySkeleton/>,
});

const VendorOverview = dynamic(() => import('@/components/dashboard/vendor-overview'), {
  ssr: false,
  loading: () => <VendorOverviewSkeleton />,
});

import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useAuth } from "@/utils/Auth/AuthProvider";
import { isSameDay, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster, toast } from 'sonner'
import { Skeleton } from '@/components/ui/Skeleton';
import MealTrendsSkeleton from '@/components/ui/MealTrendsSkeleton';
import MealMetricsSkeleton from '@/components/ui/MealMetricsSkeleton';
import ExpenseBreakdownSkeleton from '@/components/ui/ExpenseBreakdownSkeleton';
import MealCalendarSkeleton from '@/components/ui/MealCalendarSkeleton';
import VendorOverviewSkeleton from '@/components/ui/VendorOverviewSkeleton';
import RecentActivitySkeleton from '@/components/ui/RecentActivitySkeleton';


export default function DashboardPage() {
  const { vendors, mealLogs, canLogMeal, onboardingCompleted } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [dateForDialog, setDateForDialog] = useState<Date | undefined>();
  const [isMealTrackerOpen, setIsMealTrackerOpen] = useState(false);
  const isLoggedIn = !!user;
  const hasMealLimitReached = !canLogMeal(isLoggedIn);


  useEffect(() => {
    try {
      if (!onboardingCompleted) {

        setIsOnboardingOpen(true);
      }

      if (hasMealLimitReached) {
        toast.error("Meal limit reached. Please log in to continue tracking meals.");
      }
    } catch (err) {
      setError(`Something went wrong while loading your dashboard.${err}`);
    }
  }, [onboardingCompleted, hasMealLimitReached]);



  const handelclose = () => {
    setIsHiding(true);
    setTimeout(() => {
      setShowAnalysis(false);

    }, 300);

  }
  const handleAddMealClick = (date: Date) => {
    try {
      if (vendors.filter(v => v.status === 'active').length === 0) {
        toast.message('No Active Vendors', {
          description: "Please add or activate a vendor in Settings before adding a meal."
        })
        return;
      }
      if (!canLogMeal(isLoggedIn)) {
        toast.error("Meal limit reached. Please log in to continue tracking meals.");
        return;
      }
      setDateForDialog(date);
      setIsMealTrackerOpen(true);
    } catch (err) {
      setError(`Failed to open meal tracker.${err}`);
    }
  }




  return (
    <>
      <Toaster position="top-right" />
      {/* navbar for dashboard */}

      <div className="md:mt-5  min-h-screen ">
        <div className="flex items-center justify-between md:mb-6 ">
          <div className=" md:block hidden  w-full">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground ">
              Track your meals, manage vendors, and monitor expenses.
            </p>
          </div>


        </div>

        {error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <>

            <div className="flex flex-col gap-5">

              {
                showAnalysis && <Aianalysis onClose={handelclose} isHiding={isHiding} />
              }

              <div className="grid gap-6 mt-2 md:mt-6 md:grid-cols-2 lg:grid-cols-5 ">
                <div className="lg:col-span-3 flex gap-10">
                  <MealMetrics />
                </div>
                <div className=" lg:col-span-2 hidden md:block">
                  <VendorOverview />
                </div>

                <div className="grid gap-6 md:mt-6 md:grid-cols-2 lg:grid-cols-7 md:hidden">
                  <div className="md:col-span-2 lg:col-span-3">
                    <ExpenseBreakdown />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4   ">
                    <MealCalendar onAddMeal={handleAddMealClick} />

                  </div>
                </div>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-7 ">
                <div className="md:col-span-2 lg:col-span-5  md:block">

                  <MealTrends />
                  {/* <VendorOverview /> */}
                </div>
                <div className="md:col-span-2 lg:col-span-2 h-full hidden md:block">

                  {/* <ExpenseBreakdown /> */}
                  <RecentActivity />
                </div>
                <div className="md:col-span-2 lg:col-span-2 h-full  md:hidden">

                  {/* <ExpenseBreakdown /> */}
                  <VendorOverview />
                </div>

                <div className="md:col-span-2 lg:col-span-2 h-full  md:hidden">

                  {/* <ExpenseBreakdown /> */}
                  <RecentActivity />
                </div>
              </div>

              <div className="hidden md:block">
                <div className="grid gap-6 md:mt-6 md:grid-cols-2 lg:grid-cols-7 ">
                  <div className="md:col-span-2 lg:col-span-3">
                    <ExpenseBreakdown />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4   ">
                    <MealCalendar onAddMeal={handleAddMealClick} />

                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {dateForDialog && (
        <MealTracker
          isOpen={isMealTrackerOpen}
          onOpenChange={setIsMealTrackerOpen}
          date={dateForDialog}
          mealLogs={mealLogs.filter(log => isSameDay(parseISO(log.date), dateForDialog))}
          onLimitReached={() => {
            setIsMealTrackerOpen(false);
            if (!canLogMeal(isLoggedIn)) {
              toast.error("Meal limit reached. Please log in to continue tracking meals.", {
                action: {
                  label: "Log In",
                  onClick: () => router.push("/auth/login")
                }
              });
            }
          }}
        />
      )}

      <OnboardingDialog isOpen={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />
    </>
  );
}
