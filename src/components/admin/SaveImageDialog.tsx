"use client";

import { useState } from "react";
import { SCENTS } from "@/data/products";

const SLOT_OPTIONS = [
  { value: "hero", label: "Hero Image" },
  { value: "story-prepare", label: "Story: Prepare" },
  { value: "story-blend", label: "Story: Blend" },
  { value: "story-pour", label: "Story: Pour" },
  ...SCENTS.map((s) => ({
    value: `product-${s.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-")}`,
    label: s.name,
  })),
];

interface Props {
  imageBase64: string;
  imageMimeType: string;
  suggestedFilename: string;
  onClose: () => void;
}

export default function SaveImageDialog({
  imageBase64,
  imageMimeType,
  suggestedFilename,
  onClose,
}: Props) {
  const [filename, setFilename] = useState(suggestedFilename);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ url: string; publicId: string } | null>(null);
  const [error, setError] = useState("");

  // Slot picker state
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: imageBase64,
          mimeType: imageMimeType,
          filename: filename.replace(/[^a-z0-9_-]/gi, "-").toLowerCase(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!result || !selectedSlot) return;
    setPublishing(true);
    setPublishError("");

    try {
      const res = await fetch("/api/admin/assign-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: result.publicId, slot: selectedSlot }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Publish failed");
      }

      setPublished(true);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-4 space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base text-burgundy">Save Image</h3>
        <button
          onClick={onClose}
          className="text-rose-gray hover:text-charcoal transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {!result ? (
        <>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal text-sm
                         focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              placeholder="e.g. lavender-candle-product-shot"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving || !filename.trim()}
            className="w-full py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                       hover:bg-burgundy-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Image"}
          </button>
        </>
      ) : published ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
          <p className="text-green-800 font-medium text-sm">Live on your store!</p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                       hover:bg-burgundy-light transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-medium text-sm">Image saved!</p>
          </div>

          {!showSlotPicker ? (
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                           hover:bg-burgundy-light transition-colors"
              >
                Done
              </button>
              <button
                onClick={() => setShowSlotPicker(true)}
                className="flex-1 py-2 bg-gold/10 text-gold rounded-lg font-medium text-sm
                           hover:bg-gold/20 transition-colors"
              >
                Use on Landing Page
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-charcoal">
                Choose a location
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal text-sm
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              >
                <option value="">Select a slot...</option>
                <optgroup label="Page Sections">
                  {SLOT_OPTIONS.slice(0, 4).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Product Images">
                  {SLOT_OPTIONS.slice(4).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              </select>

              {publishError && <p className="text-red-600 text-sm">{publishError}</p>}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSlotPicker(false)}
                  className="flex-1 py-2 bg-rose-gray/10 text-charcoal rounded-lg font-medium text-sm
                             hover:bg-rose-gray/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!selectedSlot || publishing}
                  className="flex-1 py-2 bg-burgundy text-blush rounded-lg font-medium text-sm
                             hover:bg-burgundy-light transition-colors disabled:opacity-50"
                >
                  {publishing ? "Publishing..." : "Publish to Store"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
