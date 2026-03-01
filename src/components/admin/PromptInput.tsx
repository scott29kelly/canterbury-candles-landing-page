"use client";

import { promptTemplates } from "@/lib/admin/promptTemplates";
import type { ProviderName } from "@/lib/admin/providers/types";

const SIZES = [
  { value: "square", label: "Square (1024\u00d71024)" },
  { value: "portrait", label: "Portrait (1024\u00d71536)" },
  { value: "landscape", label: "Landscape (1536\u00d71024)" },
];

const PROVIDERS: { value: ProviderName; label: string }[] = [
  { value: "openai", label: "GPT Image 1" },
  { value: "gemini", label: "Gemini 3.1 Flash" },
  { value: "seedream", label: "Seedream 4.5" },
];

interface Props {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  size: string;
  onSizeChange: (size: string) => void;
  provider: ProviderName;
  onProviderChange: (provider: ProviderName) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  size,
  onSizeChange,
  provider,
  onProviderChange,
  onGenerate,
  loading,
}: Props) {
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

      {/* Size + Provider row */}
      <div className="flex flex-wrap gap-4">
        {/* Size selector */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Size
          </label>
          <select
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal bg-white
                       focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
          >
            {SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Provider selector */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm font-medium text-charcoal mb-2">
            Provider
          </label>
          <div className="flex gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onProviderChange(p.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    provider === p.value
                      ? "bg-burgundy text-blush"
                      : "bg-white border border-rose-gray/30 text-charcoal hover:border-burgundy/40"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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
