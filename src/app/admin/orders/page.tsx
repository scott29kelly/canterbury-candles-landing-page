"use client";

import { useEffect, useState, useCallback } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

interface OrderLineItem {
  scent: string;
  size: string;
  quantity: number;
  lineTotal: number;
}

interface Order {
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

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const ALL_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Cancel confirmation
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load orders");
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o
        )
      );
      showSuccess(`Order ${orderId} updated to ${status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(null);
    }
  }

  function handleStatusClick(orderId: string, status: OrderStatus) {
    if (status === "Cancelled") {
      setCancelTarget(orderId);
    } else {
      updateStatus(orderId, status);
    }
  }

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-burgundy">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "All" | OrderStatus)}
          className="px-3 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-gray/10 bg-parchment/50">
              <th className="text-left px-4 py-3 font-medium text-charcoal">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Date</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Customer</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Items</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal">Total</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-rose-gray">
                  {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
                </td>
              </tr>
            )}
            {filtered.map((order) => {
              const isExpanded = expandedId === order.orderId;
              const nextStatuses = STATUS_TRANSITIONS[order.status] ?? [];
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <tr key={order.orderId} className="border-b border-rose-gray/5 align-top">
                  <td colSpan={6} className="p-0">
                    {/* Summary row */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : order.orderId)}
                      className="w-full text-left grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] items-center px-4 py-2
                                 hover:bg-parchment/30 transition-colors"
                    >
                      <span className="font-mono text-xs text-charcoal">{order.orderId}</span>
                      <span className="text-charcoal text-xs">{formatDate(order.createdAt)}</span>
                      <span className="text-charcoal truncate">{order.name}</span>
                      <span className="text-center text-charcoal w-16">{itemCount}</span>
                      <span className="text-right text-charcoal w-20">${order.total}</span>
                      <span className="text-center w-28">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 bg-parchment/20 border-t border-rose-gray/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Customer info */}
                          <div>
                            <h3 className="font-medium text-charcoal text-xs uppercase tracking-wide mb-2">
                              Customer
                            </h3>
                            <p className="text-sm text-charcoal">{order.name}</p>
                            <p className="text-sm">
                              <a href={`mailto:${order.email}`} className="text-burgundy hover:underline">
                                {order.email}
                              </a>
                            </p>
                            {order.phone && (
                              <p className="text-sm">
                                <a href={`tel:${order.phone}`} className="text-burgundy hover:underline">
                                  {order.phone}
                                </a>
                              </p>
                            )}
                          </div>

                          {/* Address */}
                          <div>
                            <h3 className="font-medium text-charcoal text-xs uppercase tracking-wide mb-2">
                              Shipping Address
                            </h3>
                            {order.addressLine1 ? (
                              <div className="text-sm text-charcoal">
                                <p>{order.addressLine1}</p>
                                {order.addressLine2 && <p>{order.addressLine2}</p>}
                                <p>
                                  {order.city}{order.city && order.state ? ", " : ""}
                                  {order.state} {order.zip}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-rose-gray italic">Not provided</p>
                            )}
                          </div>
                        </div>

                        {/* Items table */}
                        <div className="mb-4">
                          <h3 className="font-medium text-charcoal text-xs uppercase tracking-wide mb-2">
                            Items
                          </h3>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-rose-gray/10">
                                <th className="text-left py-1 font-medium text-charcoal">Scent</th>
                                <th className="text-center py-1 font-medium text-charcoal">Size</th>
                                <th className="text-center py-1 font-medium text-charcoal">Qty</th>
                                <th className="text-right py-1 font-medium text-charcoal">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, i) => (
                                <tr key={i} className="border-b border-rose-gray/5">
                                  <td className="py-1 text-charcoal">{item.scent}</td>
                                  <td className="py-1 text-center text-charcoal">{item.size}</td>
                                  <td className="py-1 text-center text-charcoal">{item.quantity}</td>
                                  <td className="py-1 text-right text-charcoal">${item.lineTotal}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-4">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between gap-8">
                              <span className="text-rose-gray">Subtotal:</span>
                              <span className="text-charcoal">${order.subtotal}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between gap-8">
                                <span className="text-green-700">
                                  Discount{order.promoCode ? ` (${order.promoCode})` : ""}:
                                </span>
                                <span className="text-green-700">-${order.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between gap-8 font-medium border-t border-rose-gray/10 pt-1">
                              <span className="text-charcoal">Total:</span>
                              <span className="text-charcoal">${order.total}</span>
                            </div>
                          </div>
                        </div>

                        {/* Special instructions */}
                        {order.message && (
                          <div className="mb-4">
                            <h3 className="font-medium text-charcoal text-xs uppercase tracking-wide mb-1">
                              Special Instructions
                            </h3>
                            <p className="text-sm text-charcoal bg-white rounded-lg p-2 border border-rose-gray/10">
                              {order.message}
                            </p>
                          </div>
                        )}

                        {/* Status actions */}
                        {nextStatuses.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-rose-gray font-medium">Actions:</span>
                            {nextStatuses.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusClick(order.orderId, s)}
                                disabled={updating === order.orderId}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                                  s === "Cancelled"
                                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                    : "bg-burgundy text-blush hover:bg-burgundy-light"
                                }`}
                              >
                                {updating === order.orderId ? "Updating..." : s === "Confirmed" ? "Confirm" : s === "Shipped" ? "Mark Shipped" : s === "Delivered" ? "Mark Delivered" : "Cancel"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Order"
        message={`Are you sure you want to cancel order "${cancelTarget}"? This cannot be undone.`}
        onConfirm={() => {
          if (cancelTarget) {
            updateStatus(cancelTarget, "Cancelled");
            setCancelTarget(null);
          }
        }}
        onCancel={() => setCancelTarget(null)}
      />

      {updating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-charcoal/30">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
        </div>
      )}
    </div>
  );
}
