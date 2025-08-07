import { useStore } from '@/lib/store';
import { MealLog, MealType, Vendor } from '@/lib/types';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/Button';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/utils/Auth/AuthProvider';
import { useRouter } from 'next/navigation';

// Types
interface MealTrackerDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    date: Date;
  mealLogs: MealLog[];
    onLimitReached: () => void;
}

interface MealOptionProps {
  vendor: Vendor;
  mealType: MealType;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

interface VendorCardProps {
  vendor: Vendor;
  mealLogs: MealLog[];
  onMealToggle: (checked: boolean, vendor: Vendor, mealType: MealType) => void;
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
const MealOption = ({ vendor, mealType, isChecked, onCheckedChange }: MealOptionProps) => {
  const meal = vendor.meals[mealType];
  
  if (!meal.offered) return null;

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
      <span className="text-xs text-muted-foreground">
        ₹{meal.price}
      </span>
    </div>
  );
};

// Vendor Card Component
const VendorCard = ({ vendor, mealLogs, onMealToggle }: VendorCardProps) => {
  const isChecked = (mealType: MealType) => {
    return mealLogs.some(
      (log) => log.vendorId === vendor.id && log.mealType === mealType
    );
  };

  return (
    <div className="border p-5 rounded-xl flex flex-col justify-center gap-2">
      <div className="px-2 p-2 border-b">
        <p className="text-lg">{vendor.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:mt-2">
        {MEAL_TYPES.map((mealType) => (
          <MealOption
            key={mealType}
            vendor={vendor}
            mealType={mealType}
            isChecked={isChecked(mealType)}
            onCheckedChange={(checked) => onMealToggle(checked, vendor, mealType)}
          />
        ))}
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
    const { vendors, logMeal, deleteMealLog, canLogMeal, getRemainingMeals } = useStore();
    const { user } = useAuth();
    const router = useRouter();
  
    const isLoggedIn = !!user;
    const hasMealLimitReached = !canLogMeal(isLoggedIn);
    const remainingMeals = getRemainingMeals(isLoggedIn);
    const hasSelectedMeals = mealLogs.length > 0;
  const activeVendors = vendors.filter(v => v.status === 'active');

  const handleMealToggle = (
        checked: boolean,
        vendor: Vendor,
        mealType: MealType
    ) => {
        const dateString = format(date, 'yyyy-MM-dd');
    
        if (checked) {
            if (!canLogMeal(isLoggedIn)) {
                onLimitReached();
                toast.error("Meal limit reached. Please log in to continue.");
                return;
            }
      
            logMeal({
                id: `${dateString}-${vendor.id}-${mealType}`,
                date: dateString,
                vendorId: vendor.id,
                mealType,
                price: vendor.meals[mealType].price,
            });
        } else {
            deleteMealLog({
                date: dateString,
                vendorId: vendor.id,
                mealType,
            });
        }
    };

  const handleClose = () => onOpenChange?.(false);
  const handleLoginClick = () => router.push("/auth/login");

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
                        <div className="py-4">
              <div className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {activeVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      mealLogs={mealLogs}
                      onMealToggle={handleMealToggle}
                    />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
          
          <div className="mt-2 flex justify-end items-center">
                        <Button
                            type="button"
              onClick={handleClose}
                            disabled={!hasSelectedMeals}
                            className={!hasSelectedMeals ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            Done
                        </Button>
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
