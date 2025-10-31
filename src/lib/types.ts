export type MealType = "breakfast" | "lunch" | "dinner";
export type TrendView = "daily" | "weekly";

export interface Meal {
  offered: boolean;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  status: "active" | "inactive";
  meals?: {
    mealType: string;
    offered: boolean;
    price: number;
  }[];
}

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  vendorId: string;
  mealType: MealType;
  price: number;
  quantity: number;
  vendorName?: string;
}

export type ActivityType =
  | "meal_add"
  | "meal_remove"
  | "vendor_add"
  | "vendor_update"
  | "vendor_delete";
export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string; // ISO 8601
  description: string;
}
