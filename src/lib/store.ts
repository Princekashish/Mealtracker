import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Vendor, MealLog, Activity } from "./types";
import { startOfMonth } from "date-fns";
import axios from "axios";

interface StoreState {
  vendors: Vendor[];
  mealLogs: MealLog[];
  activities: Activity[];
  onboardingCompleted: boolean;
  currentMonth: Date;
  userId?: string;

  setUserId: (id?: string) => void;
  setCurrentMonth: (month: Date) => void;

  fetchVendors: () => Promise<void>;
  fetchMealLogs: () => Promise<void>;
  addVendor: (vendor: Vendor) => Promise<void>;
  updateVendor: (
    vendorId: string,
    updatedFields: Partial<Vendor>
  ) => Promise<void>;
  deleteVendor: (vendorId: string) => Promise<void>;
  logMeal: (
    vendorId: string,
    meals: Omit<MealLog, "vendorId" | "id">[]
  ) => Promise<void>;
  upsertMeal: (
    vendorId: string,
    meals: Omit<MealLog, "vendorId" | "id">[]
  ) => Promise<void>;
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
      setHydrated: (hydrated) => set({ _hydrated: hydrated }),

      vendors: [],
      mealLogs: [],
      activities: [],
      onboardingCompleted: false,

      // user
      setUserId: (id?: string) => set({ userId: id }),

      // date
      currentMonth: startOfMonth(new Date()),
      setCurrentMonth: (month) => set({ currentMonth: startOfMonth(month) }),

      // ---- Fetch Vendors ----
      fetchVendors: async () => {
        if (!get().userId) return;
        try {
          const { data } = await axios.get<Vendor[]>("/api/vendor");
          set({ vendors: data });
        } catch (err) {
          console.error(err);
        }
      },

      // ---- Fetch Meal Logs ----
      fetchMealLogs: async () => {
        if (!get().userId) return;
        try {
          const { data } = await axios.get<MealLog[]>("/api/meallog");
          set({ mealLogs: data });
        } catch (err) {
          console.error("Fetch meal logs failed:", err);
        }
      },

      // ---- Add Vendor ----
      addVendor: async (vendor) => {
        const { userId } = get();
        if (userId) {
          try {
            await axios.post("/api/vendor", vendor);
            await get().fetchVendors();
          } catch (err) {
            console.error("Add vendor failed:", err);
          }
        } else {
          set((state) => ({ vendors: [...state.vendors, vendor] }));
        }
        get().logActivity({
          type: "vendor_add",
          description: `Added new vendor: "${vendor.name}"`,
        });
      },

      // ---- Update Vendor ----
      updateVendor: async (vendorId, updatedFields) => {
        const { userId } = get();
        const vendor = get().vendors.find((v) => v.id === vendorId);
        if (!vendor) return;

        if (userId) {
          try {
            const updatedVendor = { ...vendor, ...updatedFields };
            await axios.put(`/api/vendor?id=${vendorId}`, updatedVendor);

            if (updatedFields.name && updatedFields.name !== vendor.name) {
              get().logActivity({
                type: "vendor_update",
                description: `Renamed vendor "${vendor.name}" to "${updatedFields.name}"`,
              });
            }

            await get().fetchVendors();
          } catch (err) {
            console.error("Update vendor failed:", err);
            throw err;
          }
        } else {
          set((state) => ({
            vendors: state.vendors.map((v) =>
              v.id === vendorId ? { ...v, ...updatedFields } : v
            ),
          }));
          if (updatedFields.name && updatedFields.name !== vendor.name) {
            get().logActivity({
              type: "vendor_update",
              description: `Renamed vendor "${vendor.name}" to "${updatedFields.name}"`,
            });
          }
        }
      },

      // ---- Delete Vendor ----
      deleteVendor: async (vendorId) => {
        const { userId } = get();
        const vendor = get().vendors.find((v) => v.id === vendorId);
        if (!vendor) return;

        if (userId) {
          try {
            await axios.delete(`/api/vendor?id=${vendorId}`);
            get().logActivity({
              type: "vendor_delete",
              description: `Deleted vendor: "${vendor.name}"`,
            });

            set((state) => ({
              vendors: state.vendors.filter((v) => v.id !== vendorId),
              mealLogs: state.mealLogs.filter((log) => log.vendorId !== vendorId),
            }));
        
            await get().fetchVendors();
            // await get().fetchMealLogs();

          } catch (err) {
            console.error("Delete vendor failed:", err);
            throw err;
          }
        } else {
          get().logActivity({
            type: "vendor_delete",
            description: `Deleted vendor: "${vendor.name}"`,
          });
          set((state) => ({
            vendors: state.vendors.filter((v) => v.id !== vendorId),
            mealLogs: state.mealLogs.filter(
              (log) => log.vendorId !== vendorId
            ),
          }));
        }
      },

      // ---- Log Meal ----
      logMeal: async (vendorId, meals) => {
        const { userId } = get();
        const vendorName =
          get().vendors.find((v) => v.id === vendorId)?.name || "a vendor";

        if (userId) {
          try {
            const response = await axios.post<MealLog[]>("/api/meallog", {
              vendorId,
              meals,
            });
            const data = Array.isArray(response.data) ? response.data : [];

            set((state) => ({
              mealLogs: [...state.mealLogs, ...data],
            }));

            meals.forEach((meal) => {
              get().logActivity({
                type: "meal_add",
                description: `${meal.mealType} added for ${vendorName} (₹${meal.price} × ${meal.quantity})`,
              });
            });
          } catch (err) {
            console.error("Log meal failed:", err);
          }
        } else {
          set((state) => {
            const newLogs: MealLog[] = meals.map((m) => ({
              ...m,
              vendorId,
              id: `local_${Date.now()}_${Math.random()}`,
            })) as MealLog[];
            return { mealLogs: [...state.mealLogs, ...newLogs] };
          });

          meals.forEach((meal) => {
            get().logActivity({
              type: "meal_add",
              description: `${meal.mealType} added for ${vendorName} (₹${meal.price} × ${meal.quantity})`,
            });
          });
        }
      },

      // ---- Upsert Meal ----
      upsertMeal: async (vendorId, meals) => {
        const { userId } = get();
        const vendorName =
          get().vendors.find((v) => v.id === vendorId)?.name || "a vendor";

        if (userId) {
          try {
            const response = await axios.post<{ logs: (MealLog & { action: "created" | "updated" })[] }>(
              "/api/meallog/upsert",
              { vendorId, meals }
            );

            const data = response.data?.logs || [];

            set((state) => {
              const updatedLogs = [...state.mealLogs];
              data.forEach((log) => {
                const existingIndex = updatedLogs.findIndex(
                  (existingLog) =>
                    existingLog.date === log.date &&
                    existingLog.vendorId === log.vendorId &&
                    existingLog.mealType === log.mealType
                );

                if (log.action === "updated" && existingIndex >= 0) {
                  updatedLogs[existingIndex] = { ...log };
                } else if (log.action === "created") {
                  updatedLogs.push(log);
                }
              });
              return { mealLogs: updatedLogs };
            });

            data.forEach((log) => {
              get().logActivity({
                type: "meal_add",
                description: `${log.mealType} ${log.action} for ${vendorName}`,
              });
            });
          } catch (err) {
            console.error("Upsert meal failed:", err);
          }
        } else {
          // guest logic (same as your version, unchanged)
          set((state) => {
            const updatedLogs = [...state.mealLogs];
            meals.forEach((meal) => {
              const existingIndex = updatedLogs.findIndex(
                (existingLog) =>
                  existingLog.date === meal.date &&
                  existingLog.vendorId === vendorId &&
                  existingLog.mealType === meal.mealType
              );

              if (existingIndex >= 0) {
                updatedLogs[existingIndex] = {
                  ...updatedLogs[existingIndex],
                  quantity: meal.quantity,
                  price: meal.price,
                };
              } else {
                updatedLogs.push({
                  ...meal,
                  vendorId,
                  id: `local_${Date.now()}_${Math.random()}`,
                });
              }
            });
            return { mealLogs: updatedLogs };
          });
        }
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
            description: `${logToDelete.mealType} cancelled from ${vendorName}`,
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

      setOnboardingCompleted: (status: boolean) =>
        set({ onboardingCompleted: status }),

      canLogMeal: (isLoggedIn: boolean) =>
        isLoggedIn || get().mealLogs.length < 5,

      getRemainingMeals: (isLoggedIn: boolean) =>
        isLoggedIn ? Infinity : Math.max(0, 5 - get().mealLogs.length),

      resetStore: () => {
        set({
          vendors: [],
          mealLogs: [],
          activities: [],
          onboardingCompleted: false,
          currentMonth: startOfMonth(new Date()),
          _hydrated: true,
        });
        localStorage.removeItem("MealTracker");
      },
    }),
    {
      name: "MealTracker",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
