import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { Meal, MealType, Vendor } from '@/lib/types';
import { PlusCircle, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { Toaster } from 'sonner';

interface OnboardingDialogProps {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    initialVendorCount?: number;
}

export default function VendorAdding({ isOpen, onOpenChange, initialVendorCount }: OnboardingDialogProps) {
    const [localVendors, setLocalVendors] = useState<Vendor[]>([]);
    const { addVendor, setOnboardingCompleted } = useStore();




    const defaultMeal: Meal = { offered: false, price: 0 };


    const handleAddLocalVendor = () => {
        // const newVendorNumber = (initialVendorCount ?? 0) + localVendors.length + 1;
        const newVendor: Vendor = {
            id: `vendor_${Date.now()}`,
            name: `${localVendors.length + 1}`,
            status: 'active',
            meals: {
                breakfast: { ...defaultMeal },
                lunch: { ...defaultMeal },
                dinner: { ...defaultMeal },
            },
        };
        setLocalVendors([...localVendors, newVendor]);
    };

    const updateLocalVendor = (vendorId: string, updatedVendor: Partial<Vendor>) => {
        setLocalVendors(localVendors.map(v => (v.id === vendorId ? { ...v, ...updatedVendor } : v)));
    };

    const updateLocalVendorMeal = (vendorId: string, mealType: MealType, updatedMeal: Partial<Meal>) => {
        setLocalVendors(localVendors.map(v => v.id === vendorId ? {
            ...v,
            meals: {
                ...v.meals,
                [mealType]: { ...v.meals[mealType], ...updatedMeal }
            }
        } : v));
    };




    const removeLocalVendor = (vendorId: string) => {
        setLocalVendors(localVendors.filter(v => v.id !== vendorId));
    };


    const handleFinish = () => {
        const finalVendors = localVendors.filter(v => v.name.trim() !== '');
        finalVendors.forEach(vendor => addVendor(vendor));
        setOnboardingCompleted(true);
        setLocalVendors([]);
        if (onOpenChange) {
            onOpenChange(false);
        }
    };


    if (!isOpen) return null;
    return (
        <div className='fixed inset-0  z-50 bg-black/80 flex justify-center items-center p-3 '>
            <div className=' relative  grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg  sm:rounded-lg rounded-xl'>
                <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X onClick={() => onOpenChange?.(false)} className='cursor-pointer' />
                </div>

                <div>
                    <div className='flex flex-col gap-2'>
                        <div className=' relative '>
                            <div className='hidden md:block'>
                                <Button variant="outline" onClick={handleAddLocalVendor} className="mt-4 flex justify-center items-center   right-0 rounded-xl border border-gray-200" >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Vendor
                                </Button>
                            </div>
                            <div className='mt-3'>
                                {localVendors.length === 0 && (
                                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                        <p className="text-muted-foreground">No vendors yet. Add your first one to get started!</p>
                                    </div>
                                )}
                                <div className=" md:mt-5  space-y-5">
                                    {localVendors.map((vendor, index) => (
                                        <div key={vendor.id} className="space-y-4 rounded-3xl border p-4 ">
                                            <div className="flex items-center justify-between relative">
                                                {/* <label htmlFor={`vendor-name-${vendor.id}`} className="text-lg font-medium">Vendor {index + 1}</label> */}
                                                {localVendors.length > 0 &&
                                                    <Button variant="ghost" className='absolute right-0 top-0' size="icon" onClick={() => removeLocalVendor(vendor.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                }
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <label htmlFor={`vendor-name-${vendor.id} `} className='text-base font-medium'>  Vendor {initialVendorCount! + index + 1}</label>
                                                <input
                                                    id={`vendor-name-${vendor.id}`}
                                                    value={vendor.name}
                                                    onChange={(e) => updateLocalVendor(vendor.id, { name: e.target.value })}
                                                    placeholder="e.g., Aunty's Kitchen"
                                                    className='py-3 px-3 rounded-xl outline-gray-200 border-gray-100 border-2 duration-500'
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
                                                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => (
                                                    <div key={mealType} className="space-y-2 rounded-md border bg-muted/20 p-2 py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <input type='checkbox'
                                                                id={`${vendor.id}-${mealType}`}
                                                                checked={vendor.meals[mealType].offered}
                                                                className=''
                                                                onChange={(e) =>
                                                                    updateLocalVendorMeal(vendor.id, mealType, {
                                                                        offered: e.target.checked,
                                                                    })
                                                                }
                                                            />
                                                            <label htmlFor={`${vendor.id}-${mealType}`} className=" peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium capitalize leading-none">
                                                                {mealType}
                                                            </label>
                                                        </div>
                                                        {vendor.meals[mealType].offered && (
                                                            <div >
                                                                <label htmlFor={`${vendor.id}-${mealType}-price`} className="sr-only">{mealType} Price</label>
                                                                <input
                                                                    id={`${vendor.id}-${mealType}-price`}
                                                                    type="number"
                                                                    value={vendor.meals[mealType].price}
                                                                    onChange={(e) => updateLocalVendorMeal(vendor.id, mealType, { price: Number(e.target.value) })}
                                                                    placeholder="Price (₹)"
                                                                    className="h-8 w-full overflow-hidden rounded-lg px-2 py-5 md:py-0 border-gray-200 border "
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='mt-2 flex justify-end items-center'>
                            <Button type="button" variant={"default"} onClick={handleFinish} disabled={localVendors.length === 0 || localVendors.every(v => v.name.trim() === '')}>Save</Button>
                        </div>

                    </div>
                </div>

            </div>
            <Toaster />
        </div>
    )
}
