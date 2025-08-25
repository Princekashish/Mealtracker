"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import VendorAdding from "./Vendor-adding";
import { Vendor } from "@/lib/types";

export default function VendorsTable() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { vendors, deleteVendor } = useStore();


  const handleAddVendorClick = () => {
    setSelectedVendor(null); // Adding new
    setDialogOpen(true);


  }
  const handleDeleteVendor = (id: string) => {
    deleteVendor(id)
  }
  const handleUpdateVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor); // Editing existing
    setDialogOpen(true);
  }

  return (
    <div className="md:p-6 mt-5  ">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 md:p-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground tracking-tighter text-sm md:text-base">Manage your tiffin vendors and their services.</p>
        </div>
        <Button onClick={handleAddVendorClick} className="md:bg-amber-500 md:hover:bg-amber-600 md:text-white flex items-center md:gap-2">
          <PlusCircle className="md:w-5 md:h-5" /> <span className="hidden md:block">Add Vendor</span>
        </Button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 p-2 md:p-6 dark:border-none ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Meal Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Price (₹)</th>
                {/* <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Contact</th> */}
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700 divide-gray-100">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-[#303030] duration-300">
                  <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300 capitalize">{vendor.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300 capitalize">{
                    Object.entries(vendor.meals).filter(([, details]) => details.offered).map(([meals]) => meals).join(', ')
                  }</td>
                  <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">{
                    Object.entries(vendor.meals).filter(([, details]) => details.price > 0).map(([, meals]) => meals.price).join(', ')
                  }</td>
                  {/* <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">{vendor.contact}</td> */}
                  <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${vendor.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                    <button className="text-gray-500 hover:text-amber-500">
                      <Pencil onClick={() => handleUpdateVendor(vendor)} className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 onClick={() => handleDeleteVendor(vendor.id)} className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <VendorAdding isOpen={dialogOpen} onOpenChange={setDialogOpen} vendorToEdit={selectedVendor} />
    </div>
  );
} 