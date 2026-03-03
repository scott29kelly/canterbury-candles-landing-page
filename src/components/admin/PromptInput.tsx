"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { promptTemplates } from "@/lib/admin/promptTemplates";
import type { PromptTemplate } from "@/lib/admin/promptTemplates";

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

interface Props {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  referenceImages: ReferenceImage[];
  onReferenceImagesChange: (imgs: ReferenceImage[]) => void;
  onGenerate: () => void;
  loading: boolean;
}

const IMAGE_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.85;

/** Resize an image file to fit within MAX_DIMENSION and return compressed base64. */
function resizeImage(file: File): Promise<ReferenceImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      const base64 = dataUrl.split(",")[1];
      resolve({ base64, mimeType: "image/jpeg" });
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export default function PromptInput({
  prompt,
  onPromptChange,
  referenceImages,
  onReferenceImagesChange,
  onGenerate,
  loading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);

  // Keep a ref to the latest images so async reader.onload never uses a stale closure
  const imagesRef = useRef(referenceImages);
  useEffect(() => {
    imagesRef.current = referenceImages;
  }, [referenceImages]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      const newImages = await Promise.all(imageFiles.map(resizeImage));
      onReferenceImagesChange([...imagesRef.current, ...newImages]);
    },
    [onReferenceImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeImage = useCallback(
    (index: number) => {
      onReferenceImagesChange(referenceImages.filter((_, i) => i !== index));
    },
    [referenceImages, onReferenceImagesChange]
  );

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
          value={selectedTemplate?.name ?? ""}
          onChange={(e) => {
            const tmpl = promptTemplates.find((t) => t.name === e.target.value);
            setSelectedTemplate(tmpl ?? null);
          }}
        >
          <option value="">Select a template...</option>
          {promptTemplates.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Template preview card */}
        {selectedTemplate && (
          <div className="mt-2 bg-parchment/50 border border-rose-gray/20 rounded-lg p-3">
            <p className="text-sm text-charcoal font-medium">{selectedTemplate.name}</p>
            <p className="text-xs text-rose-gray mt-0.5">{selectedTemplate.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  onPromptChange(selectedTemplate.prompt);
                  setSelectedTemplate(null);
                }}
                className="px-3 py-1.5 bg-burgundy text-blush rounded-lg text-sm font-medium
                           hover:bg-burgundy-light transition-colors"
              >
                Apply Template
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-3 py-1.5 bg-rose-gray/10 text-charcoal rounded-lg text-sm
                           hover:bg-rose-gray/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Prompt textarea */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              if (!loading && prompt.trim()) onGenerate();
            }
          }}
          rows={4}
          className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal resize-y
                     focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          placeholder="Describe the candle product image you want to generate..."
        />
      </div>

      {/* Reference images */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-charcoal">
            Reference Images <span className="text-rose-gray font-normal">(optional)</span>
          </label>
          {referenceImages.length > 0 && (
            <button
              type="button"
              onClick={() => onReferenceImagesChange([])}
              className="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Thumbnail row */}
        {referenceImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {referenceImages.map((img, i) => (
              <div
                key={i}
                className="relative group flex flex-col items-center"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:${img.mimeType};base64,${img.base64}`}
                    alt={`Reference ${IMAGE_LABELS[i] ?? i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-rose-gray/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs
                               leading-none flex items-center justify-center opacity-0 group-hover:opacity-100
                               transition-opacity"
                    aria-label={`Remove image ${IMAGE_LABELS[i] ?? i + 1}`}
                  >
                    &times;
                  </button>
                </div>
                <span className="text-xs text-rose-gray mt-1">
                  Image {IMAGE_LABELS[i] ?? i + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone — always visible so user can add more */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-gray/30 rounded-lg p-6 text-center cursor-pointer
                     hover:border-burgundy/40 hover:bg-parchment/30 transition-colors"
        >
          <p className="text-sm text-rose-gray">
            Drop images here or click to upload
          </p>
          <p className="text-xs text-rose-gray/60 mt-1">
            e.g. a candle label design and a reference hero shot
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Generate button */}
      <div>
        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-burgundy text-blush rounded-lg font-medium text-lg
                     hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
        <p className="text-xs text-rose-gray/60 text-center mt-1.5">
          Ctrl+Enter to generate
        </p>
      </div>
    </div>
  );
}
