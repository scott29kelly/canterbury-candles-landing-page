import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readRange, updateRange, appendRows, deleteRow } from "@/lib/admin/sheets";
import { clearPromoCache } from "@/lib/promoCodes";

const TAB_NAME = "Promo Codes";
const RANGE = `'${TAB_NAME}'!A2:F`;

interface PromoInput {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
  minPurchase: number;
  expiryDate: string | null; // M/D/YYYY or null
}

function validatePromo(p: PromoInput): string | null {
  if (!p.code || typeof p.code !== "string" || !p.code.trim()) return "Code is required";
  if (p.type !== "percent" && p.type !== "flat") return "Type must be 'percent' or 'flat'";
  if (typeof p.value !== "number" || p.value <= 0) return "Value must be greater than 0";
  if (p.type === "percent" && p.value > 100) return "Percent value cannot exceed 100";
  if (typeof p.minPurchase !== "number" || p.minPurchase < 0) return "Min purchase must be >= 0";
  return null;
}

function rowToPromo(row: unknown[]): PromoInput {
  return {
    code: typeof row[0] === "string" ? row[0].trim().toUpperCase() : "",
    type: (typeof row[1] === "string" && row[1].trim().toLowerCase() === "flat") ? "flat" : "percent",
    value: Number(row[2]) || 0,
    active: typeof row[3] === "string" ? row[3].trim().toUpperCase() === "TRUE" : row[3] === true,
    minPurchase: Number(row[4]) || 0,
    expiryDate: typeof row[5] === "string" && row[5].trim() ? row[5].trim() : null,
  };
}

function promoToRow(p: PromoInput): unknown[] {
  return [
    p.code.trim().toUpperCase(),
    p.type,
    p.value,
    p.active ? "TRUE" : "FALSE",
    p.minPurchase,
    p.expiryDate ?? "",
  ];
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await readRange(RANGE);
    const codes = rows.map(rowToPromo).filter((p) => p.code);
    return NextResponse.json({ codes });
  } catch (err) {
    console.error("Admin promo GET error:", err);
    const message = err instanceof Error ? err.message : "Failed to read promo codes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const promo = (await req.json()) as PromoInput;
    const validationError = validatePromo(promo);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check for duplicate code
    const rows = await readRange(RANGE);
    const normalized = promo.code.trim().toUpperCase();
    const exists = rows.some(
      (row) => typeof row[0] === "string" && row[0].trim().toUpperCase() === normalized
    );
    if (exists) {
      return NextResponse.json({ error: `Code "${normalized}" already exists` }, { status: 409 });
    }

    await appendRows(RANGE, [promoToRow(promo)]);
    clearPromoCache();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin promo POST error:", err);
    const message = err instanceof Error ? err.message : "Failed to add promo code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const promo = (await req.json()) as PromoInput;
    const validationError = validatePromo(promo);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const rows = await readRange(RANGE);
    const normalized = promo.code.trim().toUpperCase();
    const rowIdx = rows.findIndex(
      (row) => typeof row[0] === "string" && row[0].trim().toUpperCase() === normalized
    );

    if (rowIdx === -1) {
      return NextResponse.json({ error: `Code "${normalized}" not found` }, { status: 404 });
    }

    // Update just that row. Row index in sheet is rowIdx + 2 (1-based + header row)
    const sheetRow = rowIdx + 2;
    const range = `'${TAB_NAME}'!A${sheetRow}:F${sheetRow}`;
    await updateRange(range, [promoToRow(promo)]);
    clearPromoCache();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin promo PUT error:", err);
    const message = err instanceof Error ? err.message : "Failed to update promo code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = (await req.json()) as { code: string };
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const rows = await readRange(RANGE);
    const normalized = code.trim().toUpperCase();
    const rowIdx = rows.findIndex(
      (row) => typeof row[0] === "string" && row[0].trim().toUpperCase() === normalized
    );

    if (rowIdx === -1) {
      return NextResponse.json({ error: `Code "${normalized}" not found` }, { status: 404 });
    }

    // Sheet row is rowIdx + 2 (0-based data index + 2 for 1-based + header)
    await deleteRow(TAB_NAME, rowIdx + 1); // +1 because deleteRow is 0-based and header is row 0
    clearPromoCache();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin promo DELETE error:", err);
    const message = err instanceof Error ? err.message : "Failed to delete promo code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
