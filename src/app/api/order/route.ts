import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, notes, items } = body;

    // Validate required fields
    if (!name?.trim() || !contact?.trim() || !items || Object.keys(items).length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: name, contact, and at least one item." },
        { status: 400 }
      );
    }

    // Calculate order summary
    const totalItems = Object.values(items as Record<string, number>).reduce(
      (sum: number, qty: number) => sum + qty,
      0
    );
    const totalPrice = totalItems * 14;

    // Log the order (replace with email service, database, or webhook in production)
    console.log("=== NEW ORDER ===");
    console.log(`Name: ${name}`);
    console.log(`Contact: ${contact}`);
    console.log(`Notes: ${notes || "None"}`);
    console.log(`Items:`, items);
    console.log(`Total: ${totalItems} candles — $${totalPrice}`);
    console.log("=================");

    return NextResponse.json({
      success: true,
      message: "Order received successfully.",
      summary: {
        name,
        totalItems,
        totalPrice,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process order." },
      { status: 500 }
    );
  }
}
