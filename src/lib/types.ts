export type MealType = "breakfast" | "lunch" | "dinner";
export type TrendView = 'daily' | 'weekly';

export interface Meal {
  offered: boolean;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  status: "active" | "inactive";
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  vendorId: string;
  mealType: MealType;
  price: number;
}

export type ActivityType = 
  | 'meal_add'
  | 'meal_remove'
  | 'vendor_add'
  | 'vendor_update'
  | 'vendor_delete';
export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string; // ISO 8601
  description: string;
}
