"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { authClient } from "@/lib/auth-client";

interface Vendor {
  id: string;
  name: string;
}

interface MealLog {
  id: string;
  date: string;
  vendorId: string;
  mealType: string;
  price?: string | number;
  quantity?: number;
  vendorName?: string;
}

export default function MealDetails() {
  const { mealLogs, vendors, fetchMealLogs, setUserId } = useStore();

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("all");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    } else {
      setUserId(undefined);
    }

    if (vendors.length > 0) {
      fetchMealLogs()
    }
  }, [session?.user?.id, setUserId]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return mealLogs.filter((log) => {
      if (selectedMonth !== "all" && !log.date.startsWith(selectedMonth)) return false;
      if (selectedVendorId !== "all" && log.vendorId !== selectedVendorId) return false;
      if (selectedMealType !== "all" && log.mealType.toLowerCase() !== selectedMealType.toLowerCase()) return false;
      return true;
    });
  }, [mealLogs, selectedMonth, selectedVendorId, selectedMealType]);

  // Total price
  const totalPrice = useMemo(
    () => filteredLogs.reduce((sum, log) => sum + (Number(log.price || 0) * (log.quantity || 1)), 0),
    [filteredLogs]
  );

  return (
    <div className="md:p-6 space-y-4 relative">
      <h2 className="text-2xl font-bold p-3 md:p-0">Meal History</h2>

      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap gap-4 items-center">
        <FilterControls
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedVendorId={selectedVendorId}
          setSelectedVendorId={setSelectedVendorId}
          selectedMealType={selectedMealType}
          setSelectedMealType={setSelectedMealType}
          vendors={vendors}
          meallogss={mealLogs}
        />
        <div className="ml-auto font-semibold text-lg">Total Price: ₹{totalPrice}</div>
      </div>

      {/* Mobile Filter Icon */}
      <div className="md:hidden flex justify-between items-center">
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open Filters"
          className="p-2 rounded-md flex justify-center items-center gap-2 border px-4 text-white"
        >
          <Filter size={15} /> Filter
        </button>
        <div className="font-semibold text-base md:text-lg">Total Price: ₹{totalPrice}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
          <thead>
            <tr>
              {["Date", "Meal Type", "Vendor", "Quantity", "Unit Price", "Total Price (₹)"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 md:hidden">
                    {format(parseISO(log.date), "dd-MMM")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hidden md:block">
                    {format(parseISO(log.date), "dd-MMM-yyyy")}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{log.mealType}</td>
                  <td className="px-4 py-3 text-sm">{log.vendorName}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    {log.quantity || 1}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {log.price ? `₹${log.price}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {log.price ? `₹${Number(log.price) * (log.quantity || 1)}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm"
                >
                  🍽️ No meals in list — add some meals to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-300 dark:border-zinc-700 rounded-t-xl p-6 h-[47vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close Filters"
                  className="text-gray-600 dark:text-gray-300 font-bold text-xl"
                >
                  &times;
                </button>
              </div>

              <FilterControls
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedVendorId={selectedVendorId}
                setSelectedVendorId={setSelectedVendorId}
                selectedMealType={selectedMealType}
                setSelectedMealType={setSelectedMealType}
                vendors={vendors}
                meallogss={mealLogs}
              />

              <button
                onClick={() => setFilterOpen(false)}
                className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-md font-semibold"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter Controls Component
function FilterControls({
  selectedMonth,
  setSelectedMonth,
  selectedVendorId,
  setSelectedVendorId,
  selectedMealType,
  setSelectedMealType,
  vendors,
  meallogss,
}: {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  selectedVendorId: string;
  setSelectedVendorId: React.Dispatch<React.SetStateAction<string>>;
  selectedMealType: string;
  setSelectedMealType: React.Dispatch<React.SetStateAction<string>>;
  vendors: Vendor[];
  meallogss: MealLog[];
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div>
        <label className="mr-2 font-medium">Month:</label>
        <select
          className="dark:bg-zinc-900 px-3 py-1 rounded-md"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All</option>
          {[...new Set(meallogss.map((log) => log.date.slice(0, 7)))].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mr-2 font-medium">Vendor:</label>
        <select
          className="dark:bg-zinc-900 px-3 py-1 rounded-md"
          value={selectedVendorId}
          onChange={(e) => setSelectedVendorId(e.target.value)}
        >
          <option value="all">All</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mr-2 font-medium">Meal Type:</label>
        <select
          className="dark:bg-zinc-900 px-3 py-1 rounded-md"
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>
    </div>
  );
}
