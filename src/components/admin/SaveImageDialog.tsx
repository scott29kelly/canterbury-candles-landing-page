"use client";

import { useState } from "react";

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
  const [copied, setCopied] = useState(false);

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

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-burgundy">Save to Cloudinary</h3>
          <button
            onClick={onClose}
            className="text-rose-gray hover:text-charcoal transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Preview */}
        <div className="rounded-lg overflow-hidden border border-rose-gray/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:${imageMimeType};base64,${imageBase64}`}
            alt="Preview"
            className="w-full max-h-48 object-contain bg-parchment"
          />
        </div>

        {!result ? (
          <>
            {/* Filename input */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Filename
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal
                           focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                placeholder="e.g. lavender-candle-product-shot"
              />
              <p className="text-xs text-rose-gray mt-1">
                Saved to canterbury-candles/products/ folder
              </p>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving || !filename.trim()}
              className="w-full py-2.5 bg-burgundy text-blush rounded-lg font-medium
                         hover:bg-burgundy-light transition-colors disabled:opacity-50"
            >
              {saving ? "Uploading..." : "Save to Cloudinary"}
            </button>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <p className="text-green-800 font-medium text-sm">Saved successfully!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.url}
                  className="flex-1 text-xs px-2 py-1.5 bg-white border border-green-200 rounded text-charcoal"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-rose-gray/10 text-charcoal rounded-lg font-medium
                         hover:bg-rose-gray/20 transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
