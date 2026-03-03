"use client";

import { useState } from "react";

interface Props {
  imageBase64: string;
  imageMimeType: string;
  onApplyEdit: (prompt: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function ImageEditor({
  imageBase64,
  imageMimeType,
  onApplyEdit,
  onClose,
  loading,
}: Props) {
  const [editPrompt, setEditPrompt] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-lg border border-rose-gray/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-burgundy">Re-edit Image</h3>
        <button
          onClick={onClose}
          className="text-rose-gray hover:text-charcoal transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Image preview */}
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:${imageMimeType};base64,${imageBase64}`}
            alt="Image to edit"
            className="w-32 h-32 object-cover rounded-lg border border-rose-gray/20"
          />
        </div>
        <div className="flex-1 space-y-3">
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal resize-y
                       focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
            placeholder="Describe the edit you want (e.g. 'make the background warmer', 'add soft bokeh')..."
          />
          <button
            onClick={() => onApplyEdit(editPrompt)}
            disabled={loading || !editPrompt.trim()}
            className="px-6 py-2 bg-burgundy text-blush rounded-lg font-medium
                       hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Applying..." : "Apply Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
