import { NextResponse } from "next/server";
import { getInventory } from "@/lib/inventory";
import { SCENT_NAMES, type SizeAvailability } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const inventory = await getInventory();

  const availability: Record<string, SizeAvailability> = {};
  for (const name of SCENT_NAMES) {
    // Missing from sheet = both sizes available
    availability[name] = inventory[name] ?? { "8oz": true, "16oz": true };
  }

  return NextResponse.json(
    { availability },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
