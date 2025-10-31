import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Meal, MealType, Vendor } from '@/lib/types';
import { PartyPopper, PlusCircle, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { authClient } from '@/lib/auth-client';

interface OnboardingDialogProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function OnboardingDialog({ isOpen, onOpenChange }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [localVendors, setLocalVendors] = useState<Vendor[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { addVendor, setOnboardingCompleted, vendors: storeVendors, setUserId } = useStore();
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    async function checkVendors() {
      if (isLoggedIn) {
        try {
          setUserId(session.user.id)
        } catch (err) {
          console.error('Failed to fetch vendors from DB', err);
        }
      }

      // Check if onboarding is needed
      if ((isLoggedIn && storeVendors.length === 0) || (!isLoggedIn && storeVendors.length === 0)) {
        setShowOnboarding(true);

        // Initialize local vendors if empty
        if (localVendors.length === 0) {
          setLocalVendors([{
            id: `vendor_${Date.now()}`,
            name: '',
            status: 'active',
            meals: [
              { mealType: 'breakfast', offered: false, price: 0 },
              { mealType: 'lunch', offered: false, price: 0 },
              { mealType: 'dinner', offered: false, price: 0 },
            ],
          }]);
        }
      } else {
        setShowOnboarding(false);
      }
    }

    if (isOpen) {
      checkVendors();
    }
  }, [isOpen, isLoggedIn, storeVendors]);


  const handleAddLocalVendor = () => {
    const newVendor: Vendor = {
      id: `vendor_${Date.now()}`,
      name: `${localVendors.length + 1}`,
      status: 'active',
      meals: [
        { mealType: 'breakfast', offered: false, price: 0 },
        { mealType: 'lunch', offered: false, price: 0 },
        { mealType: 'dinner', offered: false, price: 0 },
      ],
    };
    setLocalVendors([...localVendors, newVendor]);
  };

  const updateLocalVendor = (vendorId: string, updatedVendor: Partial<Vendor>) => {
    setLocalVendors(localVendors.map(v => (v.id === vendorId ? { ...v, ...updatedVendor } : v)));
  };

  const updateLocalVendorMeal = (vendorId: string, mealType: MealType, updatedMeal: Partial<Meal>) => {
    setLocalVendors(localVendors.map(v => v.id === vendorId ? {
      ...v,
      meals: v.meals?.map(m => m.mealType === mealType ? { ...m, ...updatedMeal } : m)
    } : v));
  };

  const removeLocalVendor = (vendorId: string) => {
    setLocalVendors(localVendors.filter(v => v.id !== vendorId));
  };

  const handleNextStep = () => {
    const validVendors = localVendors.filter(v => v.name.trim() !== '');
    if (validVendors.length === 0) {
      toast.error('Please add at least one vendor');
      return;
    }
    setLocalVendors(validVendors);
    setStep(2);
  };

  const handleFinish = () => {
    const finalVendors = localVendors.filter(v => v.name.trim() !== '');
    finalVendors.forEach(vendor => addVendor(vendor));
    setOnboardingCompleted(true);
    setStep(1);
    setLocalVendors([]);
    if (onOpenChange) onOpenChange(false);
  };

  if (!isOpen || !showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-3">
      <div className="relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg rounded-xl">
        <div className="absolute right-4 top-4">
          <X onClick={() => onOpenChange?.(false)} className="cursor-pointer" />
        </div>

        {/* Step 1: Add Vendors */}
        {step === 1 && (
          <div className="flex flex-col gap-2">
            <h1 className="md:text-2xl text-lg font-bold tracking-tight">Welcome to MealTrack!</h1>
            <p className="md:text-sm text-xs text-[#8C97A9] tracking-tighter">
              Let's get you set up. Add the tiffin services you use.
            </p>

            <Button variant="outline" onClick={handleAddLocalVendor} className="mt-4 flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Vendor
            </Button>

            {localVendors.map((vendor, index) => (
              <div key={vendor.id} className="space-y-2 rounded-3xl border p-4">
                <div className="flex justify-between items-center">
                  <label className="text-base font-medium">Vendor {index + 1}</label>
                  <Button variant="ghost" size="icon" onClick={() => removeLocalVendor(vendor.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <input
                  type="text"
                  value={vendor.name}
                  placeholder="e.g., Aunty's Kitchen"
                  className="w-full rounded-xl border px-3 py-2"
                  onChange={(e) => updateLocalVendor(vendor.id, { name: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => (
                    <div key={mealType}>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={vendor.meals?.find(m => m.mealType === mealType)?.offered || false}
                          onChange={(e) =>
                            updateLocalVendorMeal(vendor.id, mealType, { offered: e.target.checked })
                          }
                        />
                        {mealType}
                      </label>
                      {vendor.meals?.find(m => m.mealType === mealType)?.offered && (
                        <input
                          type="number"
                          value={vendor.meals?.find(m => m.mealType === mealType)?.price || 0}
                          onChange={(e) =>
                            updateLocalVendorMeal(vendor.id, mealType, { price: Number(e.target.value) })
                          }
                          placeholder="Price"
                          className="w-full rounded-lg border px-2 py-1 mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-end">
              <Button onClick={handleNextStep}>Save & Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-fit rounded-full bg-green-100 p-4">
              <PartyPopper className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="font-bold text-2xl">All Set!</h1>
            <p className="text-sm max-w-sm">You're ready to start tracking your meals!</p>
            <Button onClick={handleFinish}>Go to Dashboard</Button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
