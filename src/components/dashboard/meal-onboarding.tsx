import { useStore } from '@/lib/store';
import { MealLog, MealType, Vendor } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '../ui/Button';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// Types
interface MealTrackerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  date: Date;
  mealLogs: MealLog[];
  onLimitReached: () => void;
}

interface GroupedMeal {
  date: string;
  mealType: MealType;
  quantity: number;
  price: number;
}
interface LocalMealSelection {
  vendorId: string;
  mealType: MealType;
  quantity: number;
  price: number;
  isSelected: boolean;
}

interface MealOptionProps {
  vendor: Vendor;
  mealType: MealType;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  totalPrice: number;
}

interface VendorCardProps {
  vendor: Vendor;
  date: Date;
  mealLogs: MealLog[];
  localSelections: LocalMealSelection[];
  onMealToggle: (checked: boolean, vendor: Vendor, mealType: MealType) => void;
  onQuantityChange: (vendorId: string, mealType: MealType, newQuantity: number) => void;
}

interface LoginWarningProps {
  isLoggedIn: boolean;
  remainingMeals: number;
  onLoginClick: () => void;
}

// Constants
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

// Close Button Component
const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
    <X onClick={onClose} className="cursor-pointer" />
  </div>
);

// Meal Option Component
const MealOption = ({ vendor, mealType, isChecked, onCheckedChange, quantity, onQuantityChange, totalPrice }: MealOptionProps) => {
  const meal = vendor.meals?.find(m => m.mealType === mealType);

  if (!meal || !meal.offered) return null;

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border p-2">
      <label
        htmlFor={`${vendor.id}-${mealType}`}
        className="text-sm font-medium capitalize"
      >
        {mealType}
      </label>
      <input
        type="checkbox"
        id={`${vendor.id}-${mealType}`}
        checked={isChecked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-6 w-6"
      />
      {isChecked ? (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 bg-white/10 rounded-md">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="px-2 py-1 rounded text-sm"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="px-2 py-1 rounded text-sm"
            >
              +
            </button>
          </div>
          <span className="text-xs text-green-600 font-medium">₹{totalPrice}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">₹{meal.price}</span>
      )}
    </div>
  );
};

// Vendor Card Component
const VendorCard = ({ vendor, localSelections, onMealToggle, onQuantityChange, }: VendorCardProps) => {
  const getLocalSelection = (mealType: MealType) =>
    localSelections.find(
      (selection) => selection.vendorId === vendor.id && selection.mealType === mealType
    );

  return (
    <div className="border p-5 rounded-xl flex flex-col justify-center gap-2">
      <div className="px-2 p-2 border-b">
        <p className="text-lg">{vendor.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:mt-2">
        {MEAL_TYPES.map((mealType) => {
          const localSelection = getLocalSelection(mealType);
          const isChecked = localSelection?.isSelected ?? false;
          const quantity = localSelection?.quantity ?? 1;
          const totalPrice = (localSelection?.price ?? 0) * (localSelection?.quantity ?? 1);

          return (
            <MealOption
              key={mealType}
              vendor={vendor}
              mealType={mealType}
              isChecked={isChecked}
              quantity={quantity}
              totalPrice={totalPrice}
              onCheckedChange={(checked) =>
                onMealToggle(checked, vendor, mealType)
              }
              onQuantityChange={(newQuantity) =>
                onQuantityChange(vendor.id, mealType, newQuantity)
              }
            />
          );
        })}
      </div>
    </div>
  );
};


// No Vendors Message Component
const NoVendorsMessage = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-3">
    <div className="relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg rounded-xl">
      <CloseButton onClose={onClose} />
      <div>
        <div>
          <h1 className="md:text-2xl text-lg font-bold tracking-tight">
            No Active Vendors Found
          </h1>
          <p className="md:text-sm text-xs text-[#8C97A9] tracking-tighter">
            Please add or activate a vendor from the "Settings" page before tracking meals.
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Login Warning Component
const LoginWarning = ({ isLoggedIn, remainingMeals, onLoginClick }: LoginWarningProps) => {
  if (isLoggedIn) return null;

  return (
    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
      <div className="flex items-center justify-between">
        <span>
          {remainingMeals === 0
            ? "Meal limit reached. Please log in to continue."
            : `${remainingMeals} meals remaining for non-logged-in users.`
          }
        </span>
        {remainingMeals === 0 && (
          <Button
            onClick={onLoginClick}
            size="sm"
            className="ml-2 bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1"
          >
            Log In
          </Button>
        )}
      </div>
    </div>
  );
};

// Main Component
export default function MealTracker({
  isOpen,
  onOpenChange,
  date,
  mealLogs,
  onLimitReached
}: MealTrackerDialogProps) {
  const { vendors, upsertMeal, canLogMeal, getRemainingMeals, setUserId, fetchMealLogs } = useStore();
  const { data: session } = authClient.useSession()
  const user = session?.user
  const router = useRouter();
  const isLoggedIn = !!user;
  const hasMealLimitReached = !canLogMeal(isLoggedIn);
  const remainingMeals = getRemainingMeals(isLoggedIn);

  // Memoize active vendors to prevent unnecessary re-renders
  const activeVendors = useMemo(() => vendors.filter(v => v.status === 'active'), [vendors]);

  // Local state for meal selections
  const [localSelections, setLocalSelections] = useState<LocalMealSelection[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local selections from existing meal logs
  useEffect(() => {
    if (isOpen) {
      const initialSelections: LocalMealSelection[] = [];

      activeVendors.forEach(vendor => {
        MEAL_TYPES.forEach(mealType => {
          const existingLog = mealLogs.find(
            log => log.vendorId === vendor.id && log.mealType === mealType
          );

          const mealInfo = vendor.meals?.find(m => m.mealType === mealType);

          if (existingLog && mealInfo?.offered) {
            initialSelections.push({
              vendorId: vendor.id,
              mealType,
              quantity: existingLog.quantity,
              price: existingLog.price,
              isSelected: true
            });
          }
        });
      });

      setLocalSelections(initialSelections);
    }
  }, [isOpen, activeVendors, mealLogs]);

  // Memoize computed values
  const hasSelectedMeals = useMemo(() =>
    localSelections.some(selection => selection.isSelected),
    [localSelections]
  );

  const totalPrice = useMemo(() =>
    localSelections
      .filter(selection => selection.isSelected)
      .reduce((sum, selection) => sum + (selection.price * selection.quantity), 0),
    [localSelections]
  );




  useEffect(() => {
    if (user?.id) {
      setUserId(user.id)
    }
  }, [user, setUserId, fetchMealLogs])

  const handleMealToggle = useCallback((checked: boolean, vendor: Vendor, mealType: MealType) => {
    const mealInfo = vendor.meals?.find((m) => m.mealType === mealType);

    if (!mealInfo || !mealInfo.offered) return;

    if (checked) {
      // Check if we can add more meals (for non-logged in users)
      const currentSelectedCount = localSelections.filter(s => s.isSelected).length;
      if (!isLoggedIn && currentSelectedCount >= 5) {
        onLimitReached();
        toast.error("Meal limit reached. Please log in to continue.");
        return;
      }

      // Add or update local selection
      setLocalSelections(prev => {
        const existingIndex = prev.findIndex(
          s => s.vendorId === vendor.id && s.mealType === mealType
        );

        if (existingIndex >= 0) {
          // Update existing selection
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], isSelected: true };
          return updated;
        } else {
          // Add new selection
          return [...prev, {
            vendorId: vendor.id,
            mealType,
            quantity: 1,
            price: mealInfo.price,
            isSelected: true
          }];
        }
      });
    } else {
      // Remove selection
      setLocalSelections(prev =>
        prev.filter(s => !(s.vendorId === vendor.id && s.mealType === mealType))
      );
    }
  }, [localSelections, isLoggedIn, onLimitReached]);

  const handleQuantityChange = useCallback((vendorId: string, mealType: MealType, newQuantity: number) => {
    if (newQuantity < 1) return;

    setLocalSelections(prev => {
      const existingIndex = prev.findIndex(
        selection => selection.vendorId === vendorId && selection.mealType === mealType
      );

      if (existingIndex >= 0) {
        // Only update if the selection is currently selected
        const existingSelection = prev[existingIndex];
        if (existingSelection.isSelected) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], quantity: newQuantity };
          return updated;
        }
      }

      // If we reach here, the meal is not selected, so don't change quantity
      return prev;
    });
  }, []);

  const handleDone = useCallback(async () => {
    if (!hasSelectedMeals) return;

    try {
      setIsSaving(true); // 🟢 start loading spinner
      const dateString = format(date, 'yyyy-MM-dd');

      const selectionsByVendor = localSelections
        .filter(selection => selection.isSelected)
        .reduce((acc, selection) => {
          if (!acc[selection.vendorId]) acc[selection.vendorId] = [];
          acc[selection.vendorId].push({
            date: dateString,
            mealType: selection.mealType,
            quantity: selection.quantity,
            price: selection.price,
          });
          return acc;
        }, {} as Record<string, GroupedMeal[]>);

      const promises = Object.entries(selectionsByVendor).map(([vendorId, meals]) =>
        upsertMeal(vendorId, meals)
      );

      await Promise.all(promises);

      toast.success("Meals logged successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error logging meals:", error);
      toast.error("Failed to log meals. Please try again.");
    } finally {
      setIsSaving(false); // 🔴 stop spinner whether success or fail
      fetchMealLogs() 
    }
  }, [hasSelectedMeals, localSelections, date, upsertMeal, onOpenChange, fetchMealLogs]);

  const handleClose = useCallback(() => {
    // Reset local selections when closing
    setLocalSelections([]);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleLoginClick = useCallback(() => router.push("/login"), [router]);

  // Early returns for different states
  if (!isOpen) return null;

  if (activeVendors.length === 0) {
    return <NoVendorsMessage onClose={handleClose} />;
  }

  if (hasMealLimitReached) {
    onLimitReached();
    toast.error("Meal limit reached. Please log in to continue.");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-3">
      <div className="relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg rounded-xl">
        <CloseButton onClose={handleClose} />

        <div>
          <div className="flex flex-col justify-center">
            <h1 className="md:text-2xl text-lg font-bold tracking-tight">
              Track Your Meals
            </h1>
            <p className="md:text-sm text-xs text-[#8C97A9] tracking-tighter">
              For {format(date, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>

          <div>
            <div className="py-4 ">
              <div className="h-[400px] pr-4">
                <div className="space-y-4 ">
                  {activeVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      date={date}
                      vendor={vendor}
                      mealLogs={mealLogs}
                      localSelections={localSelections}
                      onMealToggle={handleMealToggle}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            {hasSelectedMeals && (
              <div className="text-sm font-medium text-green-600">
                Total: ₹{totalPrice}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDone}
                disabled={!hasSelectedMeals || isSaving}
                className={
                  !hasSelectedMeals || isSaving
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Done'
                )}
              </Button>

            </div>
          </div>

          <LoginWarning
            isLoggedIn={isLoggedIn}
            remainingMeals={remainingMeals}
            onLoginClick={handleLoginClick}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
