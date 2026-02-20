import { NextResponse } from "next/server";
import { getInventory, isScentAvailable } from "@/lib/inventory";
import { SCENT_NAMES } from "@/data/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const inventory = await getInventory();

  const availability: Record<string, boolean> = {};
  for (const name of SCENT_NAMES) {
    availability[name] = isScentAvailable(inventory, name);
  }

  return NextResponse.json(
    { availability },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
