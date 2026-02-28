"use client";

import { useEffect, useState, useCallback } from "react";

interface InventoryRow {
  name: string;
  tag: string;
  qty8oz: number;
  qty16oz: number;
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [original, setOriginal] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inventory");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load inventory");
      }
      const data = await res.json();
      setRows(data.inventory);
      setOriginal(data.inventory.map((r: InventoryRow) => ({ ...r })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  function isDirty(row: InventoryRow, idx: number): boolean {
    const orig = original[idx];
    if (!orig) return true;
    return row.qty8oz !== orig.qty8oz || row.qty16oz !== orig.qty16oz;
  }

  const hasChanges = rows.some((row, i) => isDirty(row, i));

  function updateQty(idx: number, field: "qty8oz" | "qty16oz", value: string) {
    const num = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: num };
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updates = rows
        .filter((row, i) => isDirty(row, i))
        .map((row) => ({ name: row.name, qty8oz: row.qty8oz, qty16oz: row.qty16oz }));

      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setOriginal(rows.map((r) => ({ ...r })));
      setSuccess("Inventory updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

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
        <h1 className="font-display text-2xl text-burgundy">Inventory</h1>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-4 py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                     hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
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
              <th className="text-left px-4 py-3 font-medium text-charcoal">Scent Name</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Tag</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal w-32">8oz Stock</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal w-32">16oz Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.name}
                className={`border-b border-rose-gray/5 ${
                  isDirty(row, idx) ? "bg-gold/5" : ""
                }`}
              >
                <td className="px-4 py-2 text-charcoal">{row.name}</td>
                <td className="px-4 py-2">
                  <span className="text-xs bg-burgundy/5 text-burgundy px-2 py-0.5 rounded-full">
                    {row.tag}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.qty8oz}
                    onChange={(e) => updateQty(idx, "qty8oz", e.target.value)}
                    className="w-full text-center px-2 py-1 border border-rose-gray/20 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={row.qty16oz}
                    onChange={(e) => updateQty(idx, "qty16oz", e.target.value)}
                    className="w-full text-center px-2 py-1 border border-rose-gray/20 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
