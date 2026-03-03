"use client";

import { useCallback, useRef } from "react";
import { promptTemplates } from "@/lib/admin/promptTemplates";

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

interface Props {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  referenceImage: ReferenceImage | null;
  onReferenceImageChange: (img: ReferenceImage | null) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  referenceImage,
  onReferenceImageChange,
  onGenerate,
  loading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        onReferenceImageChange({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    },
    [onReferenceImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      {/* Template dropdown */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Template
        </label>
        <select
          className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal bg-white
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          value=""
          onChange={(e) => {
            const tmpl = promptTemplates.find((t) => t.name === e.target.value);
            if (tmpl) onPromptChange(tmpl.prompt);
          }}
        >
          <option value="">Select a template...</option>
          {promptTemplates.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt textarea */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal resize-y
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          placeholder="Describe the candle product image you want to generate..."
        />
      </div>

      {/* Reference image upload */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Reference Image <span className="text-rose-gray font-normal">(optional)</span>
        </label>

        {referenceImage ? (
          <div className="flex items-start gap-3 p-3 border border-rose-gray/30 rounded-lg bg-parchment/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:${referenceImage.mimeType};base64,${referenceImage.base64}`}
              alt="Reference"
              className="w-20 h-20 object-cover rounded-lg border border-rose-gray/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-charcoal">Reference image attached</p>
              <p className="text-xs text-rose-gray mt-0.5">
                This image will be sent alongside your prompt to guide generation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReferenceImageChange(null)}
              className="text-rose-gray hover:text-red-600 transition-colors text-lg leading-none p-1"
              aria-label="Remove reference image"
            >
              &times;
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-rose-gray/30 rounded-lg p-6 text-center cursor-pointer
                       hover:border-burgundy/40 hover:bg-parchment/30 transition-colors"
          >
            <p className="text-sm text-rose-gray">
              Drop an image here or click to upload
            </p>
            <p className="text-xs text-rose-gray/60 mt-1">
              e.g. a candle label design to incorporate into the product shot
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                e.target.value = "";
              }}
            />
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full py-3 bg-burgundy text-blush rounded-lg font-medium text-lg
                   hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
    </div>
  );
}
