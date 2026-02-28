"use client";

import { useEffect, useState, useCallback } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface PromoCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  active: boolean;
  minPurchase: number;
  expiryDate: string | null;
}

const EMPTY_PROMO: PromoCode = {
  code: "",
  type: "percent",
  value: 0,
  active: true,
  minPurchase: 0,
  expiryDate: null,
};

/** Convert M/D/YYYY or similar to YYYY-MM-DD for <input type="date"> */
function toInputDate(val: string | null): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

/** Convert YYYY-MM-DD from <input type="date"> to M/D/YYYY for Sheets */
function toSheetsDate(val: string): string | null {
  if (!val) return null;
  const [y, m, d] = val.split("-");
  return `${parseInt(m)}/${parseInt(d)}/${y}`;
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Inline editing state
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<PromoCode>(EMPTY_PROMO);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addDraft, setAddDraft] = useState<PromoCode>({ ...EMPTY_PROMO });
  const [addError, setAddError] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  // Delete confirm
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promo-codes");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load promo codes");
      }
      const data = await res.json();
      setCodes(data.codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // --- Toggle Active ---
  async function handleToggle(idx: number) {
    const code = codes[idx];
    const updated = { ...code, active: !code.active };

    // Optimistic update
    setCodes((prev) => {
      const copy = [...prev];
      copy[idx] = updated;
      return copy;
    });

    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to toggle");
      }
    } catch (err) {
      // Revert on failure
      setCodes((prev) => {
        const copy = [...prev];
        copy[idx] = code;
        return copy;
      });
      setError(err instanceof Error ? err.message : "Failed to toggle");
    }
  }

  // --- Inline Edit ---
  function startEdit(idx: number) {
    setEditIdx(idx);
    setEditDraft({ ...codes[idx] });
  }

  function cancelEdit() {
    setEditIdx(null);
  }

  async function saveEdit() {
    if (editIdx === null) return;
    setError("");
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setCodes((prev) => {
        const copy = [...prev];
        copy[editIdx] = { ...editDraft };
        return copy;
      });
      setEditIdx(null);
      showSuccess("Promo code updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  // --- Add ---
  async function handleAdd() {
    setAddError("");
    if (!addDraft.code.trim()) {
      setAddError("Code is required");
      return;
    }
    if (addDraft.value <= 0) {
      setAddError("Value must be greater than 0");
      return;
    }
    if (addDraft.type === "percent" && addDraft.value > 100) {
      setAddError("Percent value cannot exceed 100");
      return;
    }

    setAddSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addDraft),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add");
      }
      setAddDraft({ ...EMPTY_PROMO });
      setShowAdd(false);
      await fetchCodes();
      showSuccess("Promo code added");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAddSaving(false);
    }
  }

  // --- Delete ---
  async function confirmDelete() {
    if (!deleteCode) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: deleteCode }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setDeleteCode(null);
      await fetchCodes();
      showSuccess("Promo code deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
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
        <h1 className="font-display text-2xl text-burgundy">Promo Codes</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                     hover:bg-burgundy-light transition-colors"
        >
          {showAdd ? "Cancel" : "Add Code"}
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

      {/* Add Form */}
      {showAdd && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-rose-gray/10 p-4">
          <h2 className="font-display text-base text-burgundy mb-3">New Promo Code</h2>
          {addError && (
            <p className="text-red-600 text-sm mb-2">{addError}</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Code</label>
              <input
                type="text"
                value={addDraft.code}
                onChange={(e) => setAddDraft({ ...addDraft, code: e.target.value.toUpperCase() })}
                className="w-full px-2 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="SAVE20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Type</label>
              <select
                value={addDraft.type}
                onChange={(e) => setAddDraft({ ...addDraft, type: e.target.value as "percent" | "flat" })}
                className="w-full px-2 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              >
                <option value="percent">Percent</option>
                <option value="flat">Flat ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Value</label>
              <input
                type="number"
                min="0"
                step="any"
                value={addDraft.value || ""}
                onChange={(e) => setAddDraft({ ...addDraft, value: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Min Purchase</label>
              <input
                type="number"
                min="0"
                step="any"
                value={addDraft.minPurchase || ""}
                onChange={(e) => setAddDraft({ ...addDraft, minPurchase: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Expiry Date</label>
              <input
                type="date"
                value={toInputDate(addDraft.expiryDate)}
                onChange={(e) => setAddDraft({ ...addDraft, expiryDate: toSheetsDate(e.target.value) })}
                className="w-full px-2 py-1.5 border border-rose-gray/20 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={addSaving}
                className="w-full px-3 py-1.5 bg-burgundy text-blush rounded-lg font-medium text-sm
                           hover:bg-burgundy-light transition-colors disabled:opacity-50"
              >
                {addSaving ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rose-gray/10 bg-parchment/50">
              <th className="text-left px-4 py-3 font-medium text-charcoal">Code</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Type</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Value</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Active</th>
              <th className="text-center px-4 py-3 font-medium text-charcoal">Min Purchase</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal">Expiry</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-rose-gray">
                  No promo codes yet
                </td>
              </tr>
            )}
            {codes.map((code, idx) => {
              const isEditing = editIdx === idx;

              if (isEditing) {
                return (
                  <tr key={code.code} className="border-b border-rose-gray/5 bg-gold/5">
                    <td className="px-4 py-2 text-charcoal font-mono text-xs">
                      {editDraft.code}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editDraft.type}
                        onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value as "percent" | "flat" })}
                        className="px-2 py-1 border border-rose-gray/20 rounded text-xs
                                   focus:outline-none focus:ring-2 focus:ring-gold/40"
                      >
                        <option value="percent">Percent</option>
                        <option value="flat">Flat ($)</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editDraft.value || ""}
                        onChange={(e) => setEditDraft({ ...editDraft, value: parseFloat(e.target.value) || 0 })}
                        className="w-20 text-center px-2 py-1 border border-rose-gray/20 rounded text-xs
                                   focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={editDraft.active}
                        onChange={(e) => setEditDraft({ ...editDraft, active: e.target.checked })}
                        className="accent-burgundy"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editDraft.minPurchase || ""}
                        onChange={(e) => setEditDraft({ ...editDraft, minPurchase: parseFloat(e.target.value) || 0 })}
                        className="w-20 text-center px-2 py-1 border border-rose-gray/20 rounded text-xs
                                   focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={toInputDate(editDraft.expiryDate)}
                        onChange={(e) => setEditDraft({ ...editDraft, expiryDate: toSheetsDate(e.target.value) })}
                        className="px-2 py-1 border border-rose-gray/20 rounded text-xs
                                   focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={saveEdit}
                        className="text-xs text-green-700 hover:text-green-900 font-medium mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-rose-gray hover:text-charcoal font-medium"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={code.code} className="border-b border-rose-gray/5">
                  <td className="px-4 py-2 text-charcoal font-mono text-xs">{code.code}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs bg-burgundy/5 text-burgundy px-2 py-0.5 rounded-full capitalize">
                      {code.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-charcoal">
                    {code.type === "percent" ? `${code.value}%` : `$${code.value}`}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggle(idx)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        code.active ? "bg-green-500" : "bg-rose-gray/30"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          code.active ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center text-charcoal">
                    {code.minPurchase > 0 ? `$${code.minPurchase}` : "—"}
                  </td>
                  <td className="px-4 py-2 text-charcoal text-xs">
                    {code.expiryDate ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => startEdit(idx)}
                      className="text-xs text-burgundy hover:text-burgundy-light font-medium mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteCode(code.code)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteCode}
        title="Delete Promo Code"
        message={`Are you sure you want to delete "${deleteCode}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCode(null)}
      />

      {deleting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-charcoal/30">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
        </div>
      )}
    </div>
  );
}
