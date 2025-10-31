import { db } from "@/db/drizzle";
import { vendor_meals, VendorMealInsert, vendors } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface vendor {
  name: string;
  status: "active" | "inactive";
  meals?: {
    mealType: string;
    offered: boolean;
    price: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const body: vendor = await request.json();
    const userId = session.user.id;
    const findVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.name, body.name));
    if (findVendor.length > 0) {
      return NextResponse.json(
        { message: "Vendor already exists", name: findVendor[0] },
        { status: 200 }
      );
    }

    // const inserted = await db
    //   .insert(vendors)
    //   .values({
    //     userId,
    //     name: body.name,
    //     status: body.status,
    //   })
    //   .returning();

    const [vendor] = await db
      .insert(vendors)
      .values({
        userId,
        name: body.name,
        status: body.status,
      })
      .returning();

    if (body.meals && body.meals.length > 0) {
      const mealsToInsert: VendorMealInsert[] = body.meals?.map((meal) => ({
        vendorId: vendor.id,
        mealType: meal.mealType,
        offered: meal.offered,
        price: meal.price.toString(),
      }));
      await db.insert(vendor_meals).values(mealsToInsert);
    }

    return NextResponse.json(
      { message: "Vendor created successfully", vendor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating vendor:", error);
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

    const vendorList = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));

    const result = await Promise.all(
      vendorList.map(async (vendor) => {
        const offeredMeals = await db
          .select({
            mealType: vendor_meals.mealType,
            price: vendor_meals.price,
            offered: vendor_meals.offered,
          })
          .from(vendor_meals)
          .where(
            and(
              eq(vendor_meals.vendorId, vendor.id),
              eq(vendor_meals.offered, true)
            )
          );

        return {
          id: vendor.id,
          userid: vendor.userId,
          name: vendor.name,
          meals: offeredMeals.map((m) => ({
            mealType: m.mealType,
            price: Number(m.price),
            offered: m.offered,
          })),
          status: vendor.status,
        };
      })
    );


    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get vendor ID from query parameters
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("id");

    if (!vendorId) {
      return NextResponse.json(
        { message: "Vendor ID is required" },
        { status: 400 }
      );
    }

    const body: vendor = await request.json();

    // Check if vendor exists and belongs to the user
    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(
        and(
          eq(vendors.id, vendorId),
          eq(vendors.userId, userId)
        )
      );

    if (!existingVendor) {
      return NextResponse.json(
        { message: "Vendor not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    // Update vendor details
    const [updatedVendor] = await db
      .update(vendors)
      .set({
        name: body.name,
        status: body.status,
      })
      .where(eq(vendors.id, vendorId))
      .returning();

    // Update meals if provided
    if (body.meals && body.meals.length > 0) {
      // Delete existing meals
      await db
        .delete(vendor_meals)
        .where(eq(vendor_meals.vendorId, vendorId));

      // Insert updated meals
      const mealsToInsert: VendorMealInsert[] = body.meals.map((meal) => ({
        vendorId: vendorId,
        mealType: meal.mealType,
        offered: meal.offered,
        price: meal.price.toString(),
      }));
      await db.insert(vendor_meals).values(mealsToInsert);
    }

    return NextResponse.json(
      { message: "Vendor updated successfully", vendor: updatedVendor },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating vendor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get vendor ID from query parameters
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("id");

    if (!vendorId) {
      return NextResponse.json(
        { message: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // Check if vendor exists and belongs to the user
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(
        and(
          eq(vendors.id, vendorId),
          eq(vendors.userId, userId)
        )
      );

    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete associated vendor meals first (to avoid foreign key constraints)
    await db
      .delete(vendor_meals)
      .where(eq(vendor_meals.vendorId, vendorId));

    // Delete the vendor
    await db
      .delete(vendors)
      .where(eq(vendors.id, vendorId));

    return NextResponse.json(
      { message: "Vendor deleted successfully", vendorId: vendorId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
