import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readRange, updateRange } from "@/lib/admin/sheets";
import {
  rowToOrder,
  STATUS_TRANSITIONS,
  type OrderStatus,
} from "@/lib/admin/orders";

const TAB = "Orders";
const RANGE = `'${TAB}'!A2:R`;

const VALID_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await readRange(RANGE);
    const orders = rows
      .map(rowToOrder)
      .filter((o) => o.orderId)
      .reverse(); // newest first
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Admin orders GET error:", err);
    const message = err instanceof Error ? err.message : "Failed to read orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, status } = (await req.json()) as {
      orderId: string;
      status: string;
    };

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
    }

    const rows = await readRange(RANGE);
    const rowIdx = rows.findIndex(
      (row) => typeof row[0] === "string" && row[0] === orderId
    );

    if (rowIdx === -1) {
      return NextResponse.json({ error: `Order "${orderId}" not found` }, { status: 404 });
    }

    const currentStatus = String(rows[rowIdx][1] ?? "Pending") as OrderStatus;
    const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // Update columns B (status) and R (updatedAt)
    const sheetRow = rowIdx + 2; // 1-based + header
    await updateRange(`'${TAB}'!B${sheetRow}`, [[status]]);
    await updateRange(`'${TAB}'!R${sheetRow}`, [[new Date().toISOString()]]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin orders PATCH error:", err);
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
