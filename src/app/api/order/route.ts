import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRICES, SCENT_NAMES, type CandleSize } from "@/data/products";
import { getInventory, isSizeAvailable } from "@/lib/inventory";

interface OrderLineItem {
  scent: string;
  size: CandleSize;
  quantity: number;
}

interface OrderPayload {
  name: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  message?: string;
  items: OrderLineItem[];
  total: number;
}

const VALID_SIZES: CandleSize[] = ["8oz", "16oz"];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validatePayload(body: unknown): { data: OrderPayload; error?: never } | { data?: never; error: string } {
  const b = body as Record<string, unknown>;

  if (!b || typeof b !== "object") {
    return { error: "Invalid request body." };
  }

  if (!b.name || typeof b.name !== "string" || b.name.trim().length === 0) {
    return { error: "Name is required." };
  }

  if (!b.email || typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    return { error: "A valid email address is required." };
  }

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { error: "At least one item is required." };
  }

  for (const item of b.items) {
    const it = item as Record<string, unknown>;
    if (!it.scent || typeof it.scent !== "string" || !SCENT_NAMES.includes(it.scent)) {
      return { error: `Invalid scent: ${it.scent}` };
    }
    if (!VALID_SIZES.includes(it.size as CandleSize)) {
      return { error: `Invalid size: ${it.size}` };
    }
    if (typeof it.quantity !== "number" || it.quantity < 1 || !Number.isInteger(it.quantity)) {
      return { error: `Invalid quantity for ${it.scent}.` };
    }
  }

  return {
    data: {
      name: (b.name as string).trim(),
      email: (b.email as string).trim(),
      phone: typeof b.phone === "string" && b.phone.trim() ? b.phone.trim() : undefined,
      addressLine1: typeof b.addressLine1 === "string" && b.addressLine1.trim() ? b.addressLine1.trim() : undefined,
      addressLine2: typeof b.addressLine2 === "string" && b.addressLine2.trim() ? b.addressLine2.trim() : undefined,
      city: typeof b.city === "string" && b.city.trim() ? b.city.trim() : undefined,
      state: typeof b.state === "string" && b.state.trim() ? b.state.trim() : undefined,
      zip: typeof b.zip === "string" && b.zip.trim() ? b.zip.trim() : undefined,
      message: typeof b.message === "string" && b.message.trim() ? b.message.trim() : undefined,
      items: b.items as OrderLineItem[],
      total: 0, // recalculated below
    },
  };
}

function buildEmailHtml(order: OrderPayload): string {
  const rows = order.items
    .map((item) => {
      const subtotal = PRICES[item.size] * item.quantity;
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.scent}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.size}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">$${subtotal}</td>
      </tr>`;
    })
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#5a2a3a">New Canterbury Candles Order</h2>
      <p><strong>Name:</strong> ${escapeHtml(order.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(order.email)}</p>
      ${order.phone ? `<p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>` : ""}
      ${order.addressLine1
        ? `<p><strong>Shipping Address:</strong><br/>
            ${escapeHtml(order.addressLine1)}${order.addressLine2 ? `<br/>${escapeHtml(order.addressLine2)}` : ""}<br/>
            ${escapeHtml(order.city || "")}, ${escapeHtml(order.state || "")} ${escapeHtml(order.zip || "")}
          </p>`
        : `<p><strong>Shipping Address:</strong> <em>Not provided — follow up with customer</em></p>`
      }
      ${order.message ? `<p><strong>Special Instructions:</strong> ${escapeHtml(order.message)}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <thead>
          <tr style="background:#f8f4ef">
            <th style="padding:8px 12px;text-align:left">Scent</th>
            <th style="padding:8px 12px;text-align:center">Size</th>
            <th style="padding:8px 12px;text-align:center">Qty</th>
            <th style="padding:8px 12px;text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px;text-align:right;font-weight:bold">Total:</td>
            <td style="padding:12px;text-align:right;font-weight:bold;color:#b8860b">$${order.total}</td>
          </tr>
        </tfoot>
      </table>
      <!-- PAYMENT_GATEWAY_HOOK: integrate payment processing here -->
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validatePayload(body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const order = result.data;

    // Check inventory — reject if any ordered scent+size is sold out
    const inventory = await getInventory();
    const unavailable = order.items
      .filter((item) => !isSizeAvailable(inventory, item.scent, item.size));
    if (unavailable.length > 0) {
      const names = unavailable.map((i) => `${i.scent} (${i.size})`).join(", ");
      return NextResponse.json(
        { error: `Sorry, the following ${unavailable.length > 1 ? "are" : "is"} currently sold out: ${names}` },
        { status: 409 }
      );
    }

    // Recalculate total server-side — never trust the client
    order.total = order.items.reduce(
      (sum, item) => sum + PRICES[item.size] * item.quantity,
      0
    );

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_RECIPIENT } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ORDER_RECIPIENT) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json(
        { error: "Order service is not configured. Please contact us directly." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Canterbury Candles" <${SMTP_USER}>`,
      to: ORDER_RECIPIENT,
      replyTo: order.email,
      subject: `New Order from ${order.name}`,
      html: buildEmailHtml(order),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order submission failed:", err);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again later." },
      { status: 500 }
    );
  }
}
