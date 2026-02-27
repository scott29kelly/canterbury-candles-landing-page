import { NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promoCodes";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = typeof body.code === "string" ? body.code : "";
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

    if (!code.trim()) {
      return NextResponse.json({ valid: false, error: "Please enter a promo code." }, { status: 400 });
    }

    if (subtotal <= 0) {
      return NextResponse.json({ valid: false, error: "Add items to your cart first." }, { status: 400 });
    }

    const result = await validatePromoCode(code, subtotal);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Promo validation failed:", err);
    return NextResponse.json(
      { valid: false, error: "Failed to validate promo code. Please try again." },
      { status: 500 }
    );
  }
}
