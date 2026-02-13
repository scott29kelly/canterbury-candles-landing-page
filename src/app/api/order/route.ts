import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, items, total } = body;

    // Basic validation
    if (!name || !email || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the order (in production, this would go to a database or email service)
    console.log("=== NEW ORDER REQUEST ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${body.phone || "N/A"}`);
    console.log(`Notes: ${body.notes || "None"}`);
    console.log(`Items:`);
    items.forEach((item: { scent: string; quantity: number }) => {
      console.log(`  - ${item.scent} x${item.quantity} = $${item.quantity * 14}`);
    });
    console.log(`Total: $${total}`);
    console.log("========================");

    return NextResponse.json({
      success: true,
      message: "Order request received",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
