import db  from "@/db/drizzle";
import { meal_logs, type MealLogInsert } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface UpsertMealRequestBody {
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
    const body: UpsertMealRequestBody = await request.json();

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

    const userId = session.user.id;
    const results = [];

    // Process each meal individually for upsert logic
    for (const meal of body.meals) {
      const dateString = new Date(meal.date).toISOString().split("T")[0];
      
      // Check if a meal log already exists for this combination
      const existingLog = await db
        .select()
        .from(meal_logs)
        .where(
          and(
            eq(meal_logs.userId, userId),
            eq(meal_logs.vendorId, body.vendorId),
            eq(meal_logs.mealType, meal.mealType),
            eq(meal_logs.date, dateString)
          )
        )
        .limit(1);

      if (existingLog.length > 0) {
        // Update existing log with new quantity and price
        const updatedLog = await db
          .update(meal_logs)
          .set({
            quantity: meal.quantity,
            price: meal.price.toString(),
          })
          .where(
            and(
              eq(meal_logs.userId, userId),
              eq(meal_logs.vendorId, body.vendorId),
              eq(meal_logs.mealType, meal.mealType),
              eq(meal_logs.date, dateString)
            )
          )
          .returning();

        results.push({
          ...updatedLog[0],
          action: 'updated',
          mealType: meal.mealType
        });
      } else {
        // Insert new meal log
        const newLog: MealLogInsert = {
          userId,
          vendorId: body.vendorId,
          mealType: meal.mealType,
          date: dateString,
          price: meal.price.toString(),
          quantity: meal.quantity,
        };

        const insertedLog = await db
          .insert(meal_logs)
          .values(newLog)
          .returning();

        results.push({
          ...insertedLog[0],
          action: 'created',
          mealType: meal.mealType
        });
      }
    }

    return NextResponse.json(
      { 
        message: "Meals processed successfully", 
        logs: results,
        summary: {
          total: results.length,
          created: results.filter(r => r.action === 'created').length,
          updated: results.filter(r => r.action === 'updated').length
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error upserting meals:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
