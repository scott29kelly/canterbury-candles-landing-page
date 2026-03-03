"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import PromptInput from "@/components/admin/PromptInput";
import ResultsGallery from "@/components/admin/ResultsGallery";
import EditStudio from "@/components/admin/EditStudio";
import SaveImageDialog from "@/components/admin/SaveImageDialog";
import type { HistoryItem } from "@/components/admin/ImageCard";

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

const HISTORY_STORAGE_KEY = "image-generator-history";
const MAX_HISTORY_ITEMS = 20;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (Array.isArray(items)) return items.slice(0, MAX_HISTORY_ITEMS);
  } catch { /* ignore */ }
  return [];
}

function saveHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
  } catch { /* ignore — quota exceeded, etc. */ }
}

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Hydrate history from localStorage on mount
  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) {
      setHistory(stored);
      setActiveId(stored[0].id);
    }
  }, []);

  // Persist history to localStorage whenever it changes
  const isHydrated = useRef(false);
  useEffect(() => {
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    saveHistory(history);
  }, [history]);

  // Loading timer
  useEffect(() => {
    if (!loading && !editLoading) {
      setElapsedSeconds(0);
      return;
    }
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, editLoading]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { prompt };
      if (referenceImages.length > 0) {
        body.referenceImages = referenceImages;
      }

      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.startsWith("{") ? JSON.parse(text).error : `Server error ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        const item: HistoryItem = {
          id: `${Date.now()}-gemini`,
          provider: "gemini",
          base64: data.base64,
          mimeType: data.mimeType,
          durationMs: data.durationMs,
          prompt,
        };
        setHistory((prev) => [item, ...prev]);
        setActiveId(item.id);
      } else {
        setError(`Generation failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  }, [prompt, referenceImages, loading]);

  const handleEdit = useCallback((id: string) => {
    setActiveId(id);
    setEditMode(true);
    setSavingId(null);
  }, []);

  const handleSave = useCallback((id: string) => {
    setSavingId(id);
    setEditMode(false);
  }, []);

  const handleApplyEdit = useCallback(
    async (editPrompt: string, mask: string | null, provider: string) => {
      const item = history.find((h) => h.id === activeId);
      if (!item) return;

      setEditLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: item.base64,
            prompt: editPrompt,
            mask,
            provider,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text.startsWith("{") ? JSON.parse(text).error : `Server error ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          const newItem: HistoryItem = {
            id: `${Date.now()}-${provider}-edit`,
            parentId: item.id,
            provider: data.provider || provider as HistoryItem["provider"],
            base64: data.base64,
            mimeType: data.mimeType,
            durationMs: data.durationMs,
            prompt: `Edit: ${editPrompt}`,
          };
          setHistory((prev) => [newItem, ...prev]);
          setActiveId(newItem.id);
        } else {
          setError(`Edit failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        setError(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
      } finally {
        setEditLoading(false);
      }
    },
    [activeId, history]
  );

  const handleRemove = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setEditMode(false);
    }
    if (savingId === id) setSavingId(null);
  }, [activeId, savingId]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setActiveId(null);
    setEditMode(false);
    setSavingId(null);
  }, []);

  const activeItem = history.find((h) => h.id === activeId);
  const saveItem = history.find((h) => h.id === savingId);
  const isLoading = loading || editLoading;

  const providerLabel = (p: string) => {
    if (p === "gpt-image") return "GPT Image";
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-burgundy">Image Generator</h1>
        <p className="text-rose-gray text-sm mt-1">
          Generate product images using AI, re-edit with inpainting, and save to Cloudinary.
        </p>
      </div>

      {/* Two-column top section: prompt LEFT, preview RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Prompt input */}
        <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-4">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            referenceImages={referenceImages}
            onReferenceImagesChange={setReferenceImages}
            onGenerate={handleGenerate}
            loading={loading}
          />
        </div>

        {/* Right: Image preview */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-rose-gray/10">
          {isLoading && !activeItem ? (
            /* Loading state — no image yet */
            <div className="aspect-square max-h-[512px] mx-auto flex flex-col items-center justify-center bg-parchment animate-pulse">
              <div className="w-12 h-12 border-4 border-burgundy/30 border-t-burgundy rounded-full animate-spin" />
              <p className="mt-4 text-rose-gray text-sm">
                Generating with Gemini... ({elapsedSeconds}s)
              </p>
              <p className="mt-1 text-rose-gray/60 text-xs">
                Typically takes 10–30 seconds
              </p>
            </div>
          ) : activeItem ? (
            /* Active image display */
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${activeItem.mimeType};base64,${activeItem.base64}`}
                alt="Generated candle image"
                className="w-full max-h-[512px] object-contain mx-auto"
              />
              {/* Provider + duration badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-xs bg-charcoal/70 text-white px-2 py-1 rounded-full">
                  {providerLabel(activeItem.provider)}
                </span>
                <span className="text-xs bg-charcoal/70 text-white px-2 py-1 rounded-full">
                  {(activeItem.durationMs / 1000).toFixed(1)}s
                </span>
              </div>
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-burgundy/30 border-t-burgundy rounded-full animate-spin" />
                  <p className="mt-3 text-charcoal text-sm font-medium">
                    {editLoading ? "Editing" : "Generating"}... ({elapsedSeconds}s)
                  </p>
                </div>
              )}
              {/* Action buttons */}
              <div className="flex gap-2 p-3 border-t border-rose-gray/10">
                <button
                  onClick={() => handleEdit(activeItem.id)}
                  className="px-4 py-2 bg-burgundy/10 text-burgundy rounded-lg text-sm hover:bg-burgundy/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleSave(activeItem.id)}
                  className="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition-colors font-medium"
                >
                  Save to Cloudinary
                </button>
              </div>
              {/* Inline save panel */}
              {saveItem && savingId === activeItem.id && (
                <div className="px-3 pb-3">
                  <SaveImageDialog
                    imageBase64={saveItem.base64}
                    imageMimeType={saveItem.mimeType}
                    suggestedFilename={`${slugify(saveItem.prompt || "candle-image")}-${Date.now().toString(36)}`}
                    onClose={() => setSavingId(null)}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="aspect-square max-h-[512px] mx-auto flex flex-col items-center justify-center bg-parchment/30">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-rose-gray/30">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="mt-3 text-rose-gray text-sm">Generate an image to preview it here</p>
              <p className="mt-1 text-rose-gray/50 text-xs">Results appear side-by-side with the prompt</p>
            </div>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-red-800 text-sm font-medium">Something went wrong</p>
            <p className="text-red-700 text-sm mt-0.5">{error}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Edit Studio — full width below top grid */}
      <AnimatePresence>
        {editMode && activeItem && (
          <EditStudio
            key={activeItem.id}
            item={activeItem}
            onApplyEdit={handleApplyEdit}
            onClose={() => setEditMode(false)}
            loading={editLoading}
          />
        )}
      </AnimatePresence>

      {/* History thumbnail strip */}
      <ResultsGallery
        history={history}
        activeId={activeId}
        onSelect={setActiveId}
        onEdit={handleEdit}
        onSave={handleSave}
        onRemove={handleRemove}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
