import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, scents } = body;

    // Validate required fields
    if (!name || !email || !scents || scents.length === 0) {
      return NextResponse.json(
        { error: "Name, email, and at least one scent are required." },
        { status: 400 }
      );
    }

    // Calculate total
    const total = scents.length * 14;

    // Log the order (in production, send email or save to DB)
    console.log("=== New Order Request ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || "N/A"}`);
    console.log(`Scents: ${scents.join(", ")}`);
    console.log(`Total: $${total}`);
    console.log(`Notes: ${message || "None"}`);
    console.log("========================");

    // Return success
    return NextResponse.json({
      success: true,
      message: "Order request received! We'll be in touch soon.",
      order: {
        name,
        email,
        scents,
        total,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
