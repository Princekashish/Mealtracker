"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";
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
  };
  const handleDeleteVendor = (id: string) => {
    deleteVendor(id);
  };
  const handleUpdateVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor); // Editing existing
    setDialogOpen(true);
  };

  return (
    <div className="md:p-6 mt-5 font-Grift">
      <div className="flex items-center justify-between mb-6 px-3 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-xl lg:text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground tracking-tighter text-sm md:text-base hidden sm:block">Manage your tiffin vendors and their services.</p>
        </div>
        <Button onClick={handleAddVendorClick} className="md:bg-amber-500 md:hover:bg-amber-600 md:text-white flex items-center md:gap-2 ">
          Add
        </Button>
      </div>

      {/* MOBILE LIST (visible on small screens) */}
      <div className="sm:hidden px-3">
        {vendors.length > 0 ? (
          <ul className="space-y-4">
            {vendors.map((vendor, idx) => {
              return (
                <li key={vendor.id} className="flex items-center justify-between bg-white  rounded-md  ">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={`https://avatar.iran.liara.run/public/${(idx % 100) + 1}`}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-semibold ">{vendor.name}</div>
                      {/* <div className="text-sm text-gray-500 dark:text-gray-400">{vendor.contact ?? ""}</div> */}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${vendor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      <span className={`w-2 h-2 rounded-full ${vendor.status === "active" ? "bg-green-400" : "bg-gray-400"}`} />
                      <span className="capitalize">{vendor.status}</span>
                    </div> */}

                    {/* action buttons */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleUpdateVendor(vendor)} className="text-gray-500 hover:text-amber-500 p-2 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteVendor(vendor.id)} className="text-gray-500 hover:text-red-500 p-2 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">No vendors found.</div>
        )}
      </div>

      {/* DESKTOP / TABLE (visible on sm and above) */}
      <div className="hidden sm:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 p-2 md:p-6 dark:border-none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Meal Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Price (₹)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-[#f2f2f2]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700 divide-gray-100">
              {vendors.length > 0 ? (
                vendors.map((vendor) => {
                  const mealType = vendor.meals?.map((m) => m.mealType).join(", ") || "—";
                  const mealPrice = vendor.meals?.map((m) => m.price).join(", ") || "—";

                  return (
                    <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-[#303030] duration-300">
                      <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300 capitalize">
                        {vendor.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300 capitalize">
                        {mealType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                        {mealPrice}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap dark:text-gray-300">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${vendor.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                        <button onClick={() => handleUpdateVendor(vendor)} className="text-gray-500 hover:text-amber-500 p-1 rounded">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteVendor(vendor.id)} className="text-gray-500 hover:text-red-500 p-1 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400 dark:text-gray-500">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VendorAdding isOpen={dialogOpen} onOpenChange={setDialogOpen} vendorToEdit={selectedVendor} />
    </div>
  );
}
