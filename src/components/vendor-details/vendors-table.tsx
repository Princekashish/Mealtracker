import React from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const mockVendors = [
  {
    name: "Annapurna Tiffin Service",
    mealType: "Lunch",
    price: "60",
    contact: "+91 98765 43210",
    status: "Active",
  },
  {
    name: "Homely Meals",
    mealType: "Dinner",
    price: "50",
    contact: "+91 87654 32109",
    status: "Active",
  },
  {
    name: "Morning Delight",
    mealType: "Breakfast",
    price: "40",
    contact: "+91 76543 21098",
    status: "Active",
  },
  {
    name: "Spice Box",
    mealType: "Lunch",
    price: "65",
    contact: "+91 65432 10987",
    status: "Inactive",
  },
  {
    name: "Fresh Tiffin",
    mealType: "Breakfast, Lunch",
    price: "40-60",
    contact: "+91 54321 09876",
    status: "Inactive",
  },
];

export function VendorsTable() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage your tiffin vendors and their services.</p>
        </div>
        <Button className="bg-amber-400 hover:bg-amber-500 text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Vendor
        </Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-2">Vendor List</h2>
        <p className="text-muted-foreground mb-4">Manage your tiffin service providers.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Meal Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Price (₹)</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Contact</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockVendors.map((vendor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{vendor.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{vendor.mealType}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{vendor.price}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{vendor.contact}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${vendor.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                    <button className="text-gray-500 hover:text-amber-500">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 