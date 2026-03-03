"use client";

import { useCallback, useEffect, useRef } from "react";
import { promptTemplates } from "@/lib/admin/promptTemplates";

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

export default function PromptInput({
  prompt,
  onPromptChange,
  referenceImages,
  onReferenceImagesChange,
  onGenerate,
  loading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep a ref to the latest images so async reader.onload never uses a stale closure
  const imagesRef = useRef(referenceImages);
  useEffect(() => {
    imagesRef.current = referenceImages;
  }, [referenceImages]);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      let loaded = 0;
      const newImages: ReferenceImage[] = [];

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];
          newImages.push({ base64, mimeType: file.type });
          loaded++;
          if (loaded === imageFiles.length) {
            onReferenceImagesChange([...imagesRef.current, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
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

      {/* Reference images */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1">
          Reference Images <span className="text-rose-gray font-normal">(optional)</span>
        </label>

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
