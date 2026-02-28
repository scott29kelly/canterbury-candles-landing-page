import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readRange, updateRange } from "@/lib/admin/sheets";
import { clearInventoryCache } from "@/lib/inventory";
import { SCENTS, SCENT_NAMES } from "@/data/products";

const RANGE = "Sheet1!A2:C";

interface InventoryRow {
  name: string;
  tag: string;
  qty8oz: number;
  qty16oz: number;
}

function parseQty(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = Number(val.trim());
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await readRange(RANGE);

    // Build a map from sheet data
    const sheetMap = new Map<string, { qty8oz: number; qty16oz: number }>();
    for (const row of rows) {
      const name = typeof row[0] === "string" ? row[0].trim() : String(row[0] ?? "").trim();
      if (name) {
        const qty8 = parseQty(row[1]);
        const qty16 = row.length > 2 ? parseQty(row[2]) : qty8;
        sheetMap.set(name, { qty8oz: qty8, qty16oz: qty16 });
      }
    }

    // Merge with SCENTS so all 24 scents always appear
    const inventory: InventoryRow[] = SCENTS.map((scent) => {
      const data = sheetMap.get(scent.name);
      return {
        name: scent.name,
        tag: scent.tag,
        qty8oz: data?.qty8oz ?? 0,
        qty16oz: data?.qty16oz ?? 0,
      };
    });

    return NextResponse.json({ inventory });
  } catch (err) {
    console.error("Admin inventory GET error:", err);
    const message = err instanceof Error ? err.message : "Failed to read inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { updates } = (await req.json()) as {
      updates: { name: string; qty8oz: number; qty16oz: number }[];
    };

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    // Read current rows
    const currentRows = await readRange(RANGE);

    // Build mutable copy
    const rowMap = new Map<string, [string, number, number]>();
    for (const row of currentRows) {
      const name = typeof row[0] === "string" ? row[0].trim() : String(row[0] ?? "").trim();
      if (name) {
        rowMap.set(name, [name, parseQty(row[1]), row.length > 2 ? parseQty(row[2]) : parseQty(row[1])]);
      }
    }

    // Apply updates
    for (const u of updates) {
      const name = u.name.trim();
      if (!SCENT_NAMES.includes(name)) continue;
      const qty8 = Math.max(0, Math.round(Number(u.qty8oz) || 0));
      const qty16 = Math.max(0, Math.round(Number(u.qty16oz) || 0));
      rowMap.set(name, [name, qty8, qty16]);
    }

    // Ensure all scents are present, preserve order from SCENT_NAMES
    const finalRows: [string, number, number][] = SCENT_NAMES.map((name) => {
      return rowMap.get(name) ?? [name, 0, 0];
    });

    await updateRange(RANGE, finalRows);
    clearInventoryCache();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin inventory PUT error:", err);
    const message = err instanceof Error ? err.message : "Failed to update inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
