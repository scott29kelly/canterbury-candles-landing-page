/**
 * Order persistence and business logic.
 * Stores orders in the "Orders" Google Sheet tab.
 */

import { readRange, updateRange } from "@/lib/admin/sheets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderLineItem {
  scent: string;
  size: string;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  message: string;
  items: OrderLineItem[];
  subtotal: number;
  promoCode: string;
  discount: number;
  total: number;
  updatedAt: string;
}

/** Valid next statuses for each current status. */
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

/* ------------------------------------------------------------------ */
/*  ID generation                                                      */
/* ------------------------------------------------------------------ */

const TAB = "Orders";

/**
 * Generate an order ID in the format CC-YYYYMMDD-XXXX.
 * Also returns the count of existing data rows so the caller can target the
 * exact next row (avoids the Sheets append API skipping over empty formatted rows).
 */
export async function generateOrderId(): Promise<{ orderId: string; dataRowCount: number }> {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const prefix = `CC-${datePart}-`;

  const rows = await readRange(`'${TAB}'!A2:A`);

  // Count only rows that actually contain an order ID
  let dataRowCount = 0;
  let maxSeq = 0;
  for (const row of rows) {
    const id = typeof row[0] === "string" ? row[0] : "";
    if (id) dataRowCount++;
    if (id.startsWith(prefix)) {
      const seq = parseInt(id.slice(prefix.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }

  return {
    orderId: `${prefix}${String(maxSeq + 1).padStart(4, "0")}`,
    dataRowCount,
  };
}

/* ------------------------------------------------------------------ */
/*  Row serialization                                                  */
/* ------------------------------------------------------------------ */

export function orderToRow(order: Order): unknown[] {
  return [
    order.orderId,
    order.status,
    order.createdAt,
    order.name,
    order.email,
    order.phone,
    order.addressLine1,
    order.addressLine2,
    order.city,
    order.state,
    order.zip,
    order.message,
    JSON.stringify(order.items),
    order.subtotal,
    order.promoCode,
    order.discount,
    order.total,
    order.updatedAt,
  ];
}

export function rowToOrder(row: unknown[]): Order {
  let items: OrderLineItem[] = [];
  try {
    items = typeof row[12] === "string" ? JSON.parse(row[12]) : [];
  } catch {
    items = [];
  }

  return {
    orderId: String(row[0] ?? ""),
    status: (String(row[1] ?? "Pending") as OrderStatus),
    createdAt: String(row[2] ?? ""),
    name: String(row[3] ?? ""),
    email: String(row[4] ?? ""),
    phone: String(row[5] ?? ""),
    addressLine1: String(row[6] ?? ""),
    addressLine2: String(row[7] ?? ""),
    city: String(row[8] ?? ""),
    state: String(row[9] ?? ""),
    zip: String(row[10] ?? ""),
    message: String(row[11] ?? ""),
    items,
    subtotal: Number(row[13]) || 0,
    promoCode: String(row[14] ?? ""),
    discount: Number(row[15]) || 0,
    total: Number(row[16]) || 0,
    updatedAt: String(row[17] ?? ""),
  };
}

/* ------------------------------------------------------------------ */
/*  Persist a new order                                                */
/* ------------------------------------------------------------------ */

interface PersistOrderPayload {
  name: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  message?: string;
  items: { scent: string; size: string; quantity: number; lineTotal: number }[];
  subtotal: number;
  promoCode?: string;
  discount?: number;
  total: number;
}

export async function persistOrder(payload: PersistOrderPayload): Promise<string> {
  const { orderId, dataRowCount } = await generateOrderId();
  const now = new Date().toISOString();

  const order: Order = {
    orderId,
    status: "Pending",
    createdAt: now,
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? "",
    addressLine1: payload.addressLine1 ?? "",
    addressLine2: payload.addressLine2 ?? "",
    city: payload.city ?? "",
    state: payload.state ?? "",
    zip: payload.zip ?? "",
    message: payload.message ?? "",
    items: payload.items,
    subtotal: payload.subtotal,
    promoCode: payload.promoCode ?? "",
    discount: payload.discount ?? 0,
    total: payload.total,
    updatedAt: now,
  };

  // Write to the exact next row after existing data.
  // Row 1 = header, so first data row is 2, next empty row = dataRowCount + 2.
  const targetRow = dataRowCount + 2;
  await updateRange(`'${TAB}'!A${targetRow}:R${targetRow}`, [orderToRow(order)]);
  return orderId;
}
