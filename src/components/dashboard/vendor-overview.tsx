"use client"

import { useEffect, useMemo, useState } from "react"

import { Skeleton } from "../ui/Skeleton"
import { useStore } from "@/lib/store"
import { Progress } from "../ui/process"
import { isSameMonth, parseISO } from "date-fns"
import { authClient } from "@/lib/auth-client"

export default function VendorOverview() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mealLogs = useStore((state) => state.mealLogs);
  const currentMonth = useStore((state) => state.currentMonth);
  const hydrated = useStore((state) => state._hydrated);
  const { vendors, fetchVendors } = useStore()

  const { data: session } = authClient.useSession();
  const setUserId = useStore((state) => state.setUserId);

  useEffect(() => {
    async function loadVendors() {
      try {
        setLoading(true)
        setError(null)
      } catch (err) {
        console.error("Failed to load vendors:", err)
        setError("Failed to load vendors. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadVendors()

    if (session?.user?.id) {
      setUserId(session.user.id);
    } else {
      setUserId(undefined);
    }

    fetchVendors()

    if (hydrated) {
      setLoading(false);
    }



  }, [hydrated, session?.user?.id, setUserId])

  const vendorMealCounts = useMemo(() => {
    if (!hydrated) return {};
    const counts: { [key: string]: number } = {};
    const logsThisMonth = mealLogs.filter(log => isSameMonth(parseISO(log.date), new Date()));
    logsThisMonth.forEach(log => {
      if (!counts[log.vendorId]) {
        counts[log.vendorId] = 0;
      }
      counts[log.vendorId]++;
    });
    return counts;
  }, [mealLogs, currentMonth]);


  if (!hydrated || loading) {
    // You could show a skeleton loader here
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="col-span-3">
        <div className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-3 p-5 rounded-3xl md:border md:border-gray-200 bg-[#FBFBFB] dark:bg-[#161616] dark:md:border-none md:bg-transparent ">
      <div>
        <h1 className="md:text-2xl text-lg font-bold tracking-tight ">Vendor Overview</h1>
        <p className="md:text-sm text-xs tracking-tight text-[#8C97A9] ">Track your active meal vendors.</p>
      </div>
      <div className="pt-5">
        <div className="space-y-4  overflow-hidden h-[140px] md:h-[124px]  scrollbar-hide overflow-y-scroll">
          {loading
            ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center ">
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
              ))
            : vendors.length > 0 && vendors.map((vendor, index) => {
              const mealsTaken = vendorMealCounts[vendor.id] || 0;
              const totalMeals = 34;
              return (
                (
                  <div key={index} className="flex items-center ">

                    <div className="flex-1 space-y-1">


                      <div className="flex justify-between items-center">
                        <div className="flex justify-center items-center">
                          <div className="h-9 w-9 mr-3">
                            <img src={`https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`
                            } />
                          </div>
                          <div>
                            <p className="md:text-sm text-xs font-medium leading-none">{vendor.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">

                          <div className={`px-3 py-1 font-semibold rounded-xl text-xs  ${vendor.status === 'active' ? "border-transparent bg-green-100 text-green-800" : " "}`}>
                            {vendor.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">

                        <Progress value={(mealsTaken / totalMeals) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                )
              )
            })}
        </div>
      </div>
    </div>
  )
}
