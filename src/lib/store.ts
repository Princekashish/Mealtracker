import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Vendor, MealLog, Activity } from "./types";
import { startOfMonth } from "date-fns";

interface StoreState {
  vendors: Vendor[];
  mealLogs: MealLog[];
  activities: Activity[];
  onboardingCompleted: boolean;
  currentMonth: Date;
  setCurrentMonth: (month: Date) => void;
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendorId: string, updatedFields: Partial<Vendor>) => void;
  deleteVendor: (vendorId: string) => void;
  logMeal: (mealLog: MealLog) => void;
  deleteMealLog: (logToDelete: Omit<MealLog, "price" | "id">) => void;
  logActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  setOnboardingCompleted: (status: boolean) => void;
  _hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  canLogMeal: (isLoggedIn: boolean) => boolean;
  getRemainingMeals: (isLoggedIn: boolean) => number;
  resetStore: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      setHydrated: (hydrated) => {
        set({
          _hydrated: hydrated,
        });
      },
      vendors: [],
      mealLogs: [],
      activities: [],
      onboardingCompleted: false,

      currentMonth: startOfMonth(new Date()),
      setCurrentMonth: (month) => set({ currentMonth: startOfMonth(month) }),

      addVendor: (vendor) => {
        set((state) => ({ vendors: [...state.vendors, vendor] }));
        get().logActivity({
          type: "vendor_add",
          description: `Added new vendor: "${vendor.name}"`,
        });
      },
      updateVendor: (vendorId, updatedFields) => {
        const vendor = get().vendors.find((v) => v.id === vendorId);
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, ...updatedFields } : v
          ),
        }));
        if (
          updatedFields.name &&
          vendor &&
          updatedFields.name !== vendor.name
        ) {
          get().logActivity({
            type: "vendor_update",
            description: `Renamed vendor "${vendor.name}" to "${updatedFields.name}"`,
          });
        }
      },
      deleteVendor: (vendorId) => {
        const vendor = get().vendors.find((v) => v.id === vendorId);
        if (vendor) {
          get().logActivity({
            type: "vendor_delete",
            description: `Deleted vendor: "${vendor.name}"`,
          });
          set((state) => ({
            vendors: state.vendors.filter((v) => v.id !== vendorId),
            mealLogs: state.mealLogs.filter((log) => log.vendorId !== vendorId),
          }));
        }
      },
      logMeal: (mealLog) => {
        const vendorName =
          get().vendors.find((v) => v.id === mealLog.vendorId)?.name ||
          "a vendor";
        set((state) => {
          // Prevent duplicates
          const existingLog = state.mealLogs.find(
            (log) =>
              log.date === mealLog.date &&
              log.vendorId === mealLog.vendorId &&
              log.mealType === mealLog.mealType
          );
          if (existingLog) return {}; // No change

          get().logActivity({
            type: "meal_add",
            description: `${
              mealLog.mealType.charAt(0).toUpperCase() +
              mealLog.mealType.slice(1)
            } received from ${vendorName}`,
          });
          return { mealLogs: [...state.mealLogs, mealLog] };
        });
      },
      deleteMealLog: (logToDelete) => {
        const vendorName =
          get().vendors.find((v) => v.id === logToDelete.vendorId)?.name ||
          "a vendor";
        const logExists = get().mealLogs.some(
          (log) =>
            log.date === logToDelete.date &&
            log.vendorId === logToDelete.vendorId &&
            log.mealType === logToDelete.mealType
        );

        if (logExists) {
          get().logActivity({
            type: "meal_remove",
            description: `${
              logToDelete.mealType.charAt(0).toUpperCase() +
              logToDelete.mealType.slice(1)
            } cancelled from ${vendorName}`,
          });
          set((state) => ({
            mealLogs: state.mealLogs.filter(
              (log) =>
                !(
                  log.date === logToDelete.date &&
                  log.vendorId === logToDelete.vendorId &&
                  log.mealType === logToDelete.mealType
                )
            ),
          }));
        }
      },
      logActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `activity_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ activities: [newActivity, ...state.activities] }));
      },
      setOnboardingCompleted: (status: boolean) => {
        set({ onboardingCompleted: status });
      },
      canLogMeal: (isLoggedIn: boolean) => {
        if (isLoggedIn) return true;
        return get().mealLogs.length < 5;
      },
      getRemainingMeals: (isLoggedIn: boolean) => {
        if (isLoggedIn) return Infinity;
        return Math.max(0, 5 - get().mealLogs.length);
      },
      resetStore: () => {
        set({
          vendors: [],
          mealLogs: [],
          activities: [],
          onboardingCompleted: false,
          currentMonth: startOfMonth(new Date()),
          _hydrated: true,
        });
        localStorage.removeItem('MealTracker');
      },
    }),
    {
      name: "MealTracker", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// get formattedCurrentMonth() {
//   return format(get().currentMonth, "MMMM yyyy");
// },
