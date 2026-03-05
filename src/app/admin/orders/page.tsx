"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const selectedOrder = orders.find((o) => o.orderId === selectedId) ?? null;

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

  // Close drawer on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedId) {
        setSelectedId(null);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  // Auto-deselect when filter hides the selected order
  useEffect(() => {
    if (!selectedId) return;
    const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);
    if (!filtered.some((o) => o.orderId === selectedId)) {
      setSelectedId(null);
    }
  }, [filter, orders, selectedId]);

  // Focus close button when drawer opens
  useEffect(() => {
    if (selectedId && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedId]);

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
              const isSelected = selectedId === order.orderId;
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <tr
                  key={order.orderId}
                  onClick={() => setSelectedId(isSelected ? null : order.orderId)}
                  className={`border-b border-rose-gray/5 border-l-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-l-burgundy bg-gold/10"
                      : "border-l-transparent hover:bg-parchment/30"
                  }`}
                >
                  <td className="px-4 py-2 font-mono text-xs text-charcoal">{order.orderId}</td>
                  <td className="px-4 py-2 text-xs text-charcoal">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2 text-charcoal truncate max-w-[160px]">{order.name}</td>
                  <td className="px-4 py-2 text-center text-charcoal">{itemCount}</td>
                  <td className="px-4 py-2 text-right text-charcoal">${order.total}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile backdrop */}
      {selectedId && (
        <div
          className="fixed inset-0 z-[45] bg-charcoal/30 md:hidden"
          onClick={() => setSelectedId(null)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        role="complementary"
        aria-label="Order details"
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[85vw] z-[45] bg-white shadow-xl border-l border-rose-gray/20 transform transition-transform duration-300 ${
          selectedId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedOrder && (
          <div className="flex flex-col h-full">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-rose-gray/10 bg-parchment/30">
              <div>
                <h2 className="font-display text-lg text-burgundy">{selectedOrder.name}</h2>
                <p className="text-xs font-mono text-rose-gray">{selectedOrder.orderId}</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setSelectedId(null)}
                aria-label="Close order details"
                className="p-1.5 rounded-lg hover:bg-rose-gray/10 transition-colors text-charcoal"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Status + Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-rose-gray uppercase tracking-wide">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                {(STATUS_TRANSITIONS[selectedOrder.status] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(STATUS_TRANSITIONS[selectedOrder.status] ?? []).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusClick(selectedOrder.orderId, s)}
                        disabled={updating === selectedOrder.orderId}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          s === "Cancelled"
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            : "bg-burgundy text-blush hover:bg-burgundy-light shadow-sm"
                        }`}
                      >
                        {updating === selectedOrder.orderId
                          ? "Updating..."
                          : s === "Confirmed"
                          ? "Confirm"
                          : s === "Shipped"
                          ? "Mark Shipped"
                          : s === "Delivered"
                          ? "Mark Delivered"
                          : "Cancel"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-xs font-medium text-rose-gray uppercase tracking-wide mb-2">Contact</h3>
                <div className="space-y-1.5 text-sm">
                  <a href={`mailto:${selectedOrder.email}`} className="flex items-center gap-2 text-burgundy hover:underline">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="16" height="12" rx="2" />
                      <path d="M2 6l8 5 8-5" />
                    </svg>
                    {selectedOrder.email}
                  </a>
                  {selectedOrder.phone && (
                    <a href={`tel:${selectedOrder.phone}`} className="flex items-center gap-2 text-burgundy hover:underline">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3h4l2 5-2.5 1.5A11 11 0 0010.5 13.5L12 11l5 2v4a1 1 0 01-1 1A16 16 0 012 4a1 1 0 011-1z" />
                      </svg>
                      {selectedOrder.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-xs font-medium text-rose-gray uppercase tracking-wide mb-2">Shipping Address</h3>
                {selectedOrder.addressLine1 ? (
                  <div className="text-sm text-charcoal">
                    <p>{selectedOrder.addressLine1}</p>
                    {selectedOrder.addressLine2 && <p>{selectedOrder.addressLine2}</p>}
                    <p>
                      {selectedOrder.city}{selectedOrder.city && selectedOrder.state ? ", " : ""}
                      {selectedOrder.state} {selectedOrder.zip}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-rose-gray italic">Not provided</p>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-medium text-rose-gray uppercase tracking-wide mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-baseline justify-between text-sm">
                      <div>
                        <span className="text-charcoal">{item.scent}</span>
                        <span className="text-rose-gray ml-1.5">{item.size} &times; {item.quantity}</span>
                      </div>
                      <span className="text-charcoal font-medium">${item.lineTotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-rose-gray/10 pt-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-rose-gray">Subtotal</span>
                    <span className="text-charcoal">${selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-700">
                        Discount{selectedOrder.promoCode ? ` (${selectedOrder.promoCode})` : ""}
                      </span>
                      <span className="text-green-700">-${selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium border-t border-rose-gray/10 pt-1">
                    <span className="text-charcoal">Total</span>
                    <span className="text-charcoal">${selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.message && (
                <div>
                  <h3 className="text-xs font-medium text-rose-gray uppercase tracking-wide mb-2">Special Instructions</h3>
                  <p className="text-sm text-charcoal bg-parchment/30 rounded-lg p-3 border border-rose-gray/10">
                    {selectedOrder.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
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
