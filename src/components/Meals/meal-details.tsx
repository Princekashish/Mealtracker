"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from 'date-fns';
import { authClient } from "@/lib/auth-client";

interface Vendor {
  id: string;
  name: string;
  // optional: avatarUrl?: string;
}

interface MealLog {
  id: string;
  date: string;
  vendorId: string;
  mealType: string;
  price?: string | number;
  quantity?: number;
  vendorName?: string;
  // optional: vendorAvatar?: string;
}

export default function MealDetails() {
  const { mealLogs, vendors, fetchMealLogs, setUserId } = useStore();

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("all");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");

  // Mobile popup state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<"vendors" | "date" | "mealType" | null>(null);

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

  // Total price (used for sm and up)
  const totalPrice = useMemo(
    () => filteredLogs.reduce((sum, log) => sum + (Number(log.price || 0) * (log.quantity || 1)), 0),
    [filteredLogs]
  );

  // Helpers for mobile popup interactions
  const openFilterPopup = (type: "vendors" | "date" | "mealType") => {
    setFilterType(type);
    setFilterOpen(true);
  };

  const closeFilterPopup = () => {
    setFilterOpen(false);
    // keep filterType set so closing returns to the same type next open if needed
  };

  const applyVendorFilter = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    closeFilterPopup();
  };

  const applyDateFilter = (dateKey: string) => {
    setSelectedMonth(dateKey);
    closeFilterPopup();
  };

  const applyMealTypeFilter = (mealType: string) => {
    setSelectedMealType(mealType);
    closeFilterPopup();
  };

  return (
    <div className="md:p-6 space-y-4 relative font-Grift">
      <h2 className="text-2xl font-semibold sm:font-bold p-3 md:p-0">Meals <span className=" hidden sm:block">History</span></h2>

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

      {/* MOBILE: three pill buttons (Vendors / Date / MealType) replacing previous single filter */}
      <div className="md:hidden flex items-center gap-3 px-4">
        <button
          onClick={() => openFilterPopup("vendors")}
          className="px-4 py-2 rounded-full border text-sm flex items-center gap-2"
        >
          Vendors
        </button>

        <button
          onClick={() => openFilterPopup("date")}
          className="px-4 py-2 rounded-full border text-sm flex items-center gap-2"
        >
          Date
        </button>

        <button
          onClick={() => openFilterPopup("mealType")}
          className="px-4 py-2 rounded-full border text-sm flex items-center gap-2"
        >
          MealType
        </button>

        {/* Total removed from mobile as requested */}
      </div>

      {/* TABLE: visible on sm and above */}
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-900 hidden sm:block">
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
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
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

      {/* MOBILE LIST: visible under sm (compact layout matching your screenshot) */}
      <div className="sm:hidden">
        {filteredLogs.length > 0 ? (
          <ul className="space-y-4 px-4 pb-8">
            {filteredLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between bg-white rounded-md">
                {/* left: avatar */}
                <div className="flex items-center gap-4 py-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {/* if you have vendor avatar use it, otherwise show initial */}
                    {/* <img src={log.vendorAvatar} alt={log.vendorName} className="w-full h-full object-cover" /> */}
                    <span className="text-sm font-semibold text-gray-700">
                      {log.vendorName ? log.vendorName.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{log.vendorName ?? "Unknown"}</div>
                    <div className="text-sm text-gray-500">{format(parseISO(log.date), "dd MMM")}</div>
                  </div>
                </div>

                {/* right: amount + meal type */}
                <div className="text-right pr-2">
                  <div className="text-2xl font-bold">{log.price ? `+ ₹${log.price}` : "-"}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {log.mealType ? `${capitalize(log.mealType)} (${log.quantity || 1})` : "-"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">🍽️ No meals in list — add some meals to get started!</div>
        )}
      </div>

      {/* Mobile Bottom-up Popup (content depends on filterType) */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={closeFilterPopup}
              className="fixed inset-0 bg-black z-40"
            />

            {/* popup panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white   dark:border-zinc-700 rounded-t-xl p-4 min-h-[40vh] max-h-[65vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  {filterType === "vendors" ? "Choose Vendor" : filterType === "date" ? "Choose Date Range" : "Choose Meal Type"}
                </h3>
                <button
                  onClick={closeFilterPopup}
                  aria-label="Close Filters"
                  className="text-gray-600 dark:text-gray-300 font-bold text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Vendors list */}
              {filterType === "vendors" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="vendor_all"
                      type="radio"
                      name="vendor"
                      checked={selectedVendorId === "all"}
                      onChange={() => setSelectedVendorId("all")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="vendor_all" className="text-sm">All Vendors</label>
                  </div>

                  {vendors.map((v: Vendor) => (
                    <div key={v.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          id={`vendor_${v.id}`}
                          type="radio"
                          name="vendor"
                          checked={selectedVendorId === v.id}
                          onChange={() => setSelectedVendorId(v.id)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`vendor_${v.id}`} className="text-sm">{v.name}</label>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => { applyVendorFilter(selectedVendorId || "all"); }}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-md"
                    >
                      Apply
                    </button>
                    <button
                      onClick={closeFilterPopup}
                      className="flex-1 border py-2 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Date options */}
              {filterType === "date" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="date_this_month"
                      type="radio"
                      name="date_range"
                      checked={selectedMonth === "this_month"}
                      onChange={() => setSelectedMonth("this_month")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="date_this_month" className="text-sm">This month</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="date_30"
                      type="radio"
                      name="date_range"
                      checked={selectedMonth === "last_30_days"}
                      onChange={() => setSelectedMonth("last_30_days")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="date_30" className="text-sm">Last 30 days</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="date_90"
                      type="radio"
                      name="date_range"
                      checked={selectedMonth === "last_90_days"}
                      onChange={() => setSelectedMonth("last_90_days")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="date_90" className="text-sm">Last 90 days</label>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => applyDateFilter(selectedMonth)}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-md"
                    >
                      Apply
                    </button>
                    <button
                      onClick={closeFilterPopup}
                      className="flex-1 border py-2 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Meal Type options */}
              {filterType === "mealType" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      id="meal_breakfast"
                      type="radio"
                      name="meal_type"
                      checked={selectedMealType === "breakfast"}
                      onChange={() => setSelectedMealType("breakfast")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="meal_breakfast" className="text-sm">Breakfast</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="meal_lunch"
                      type="radio"
                      name="meal_type"
                      checked={selectedMealType === "lunch"}
                      onChange={() => setSelectedMealType("lunch")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="meal_lunch" className="text-sm">Lunch</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="meal_dinner"
                      type="radio"
                      name="meal_type"
                      checked={selectedMealType === "dinner"}
                      onChange={() => setSelectedMealType("dinner")}
                      className="w-4 h-4"
                    />
                    <label htmlFor="meal_dinner" className="text-sm">Dinner</label>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => applyMealTypeFilter(selectedMealType)}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-md"
                    >
                      Apply
                    </button>
                    <button
                      onClick={closeFilterPopup}
                      className="flex-1 border py-2 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter Controls Component (unchanged — used for desktop and popup reuse)
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

// small helper
function capitalize(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
