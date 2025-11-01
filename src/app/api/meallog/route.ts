
import db from "@/db/drizzle";
import { meal_logs, vendors, type MealLogInsert } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface MealRequestBody {
  vendorId: string;
  meals: {
    mealType: string;
    date: string;
    price: number;
    quantity: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: MealRequestBody = await request.json();

    // Validate body
    if (!body.vendorId) {
      return NextResponse.json(
        { message: "Vendor ID is required" },
        { status: 400 }
      );
    }
    if (!body.meals || body.meals.length === 0) {
      return NextResponse.json(
        { message: "No meals provided" },
        { status: 400 }
      );
    }

    // Prepare data to insert
    const mealsToInsert: MealLogInsert[] = body.meals?.map((meal) => ({
      userId: session.user.id,
      vendorId: body.vendorId,
      mealType: meal.mealType,
      date: new Date(meal.date).toISOString().split("T")[0],
      price: meal.price.toString(), // Convert to string for decimal support
      quantity: meal.quantity,
    }));

    // Insert into DB
    const insertedMeals = await db
      .insert(meal_logs)
      .values(mealsToInsert)
      .returning();

    return NextResponse.json(
      { message: "Meals logged successfully", logs: insertedMeals },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging meals:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Join meal_logs with vendors to get vendor name
    const mealLogsWithVendor = await db
      .select({
        id: meal_logs.id,
        userId: meal_logs.userId,
        vendorId: meal_logs.vendorId,
        mealType: meal_logs.mealType,
        date: meal_logs.date,
        price: meal_logs.price,
        quantity: meal_logs.quantity,
        vendorName: vendors.name, // 👈 extract vendor name
      })
      .from(meal_logs)
      .leftJoin(vendors, eq(meal_logs.vendorId, vendors.id))
      .where(eq(meal_logs.userId, userId));

    if (mealLogsWithVendor.length === 0) {
      return NextResponse.json(
        { message: "No meal logs found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(mealLogsWithVendor, { status: 200 });
  } catch (error) {
    console.error("Error fetching meal logs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
