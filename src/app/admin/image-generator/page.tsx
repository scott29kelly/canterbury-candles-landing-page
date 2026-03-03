"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import PromptInput from "@/components/admin/PromptInput";
import ResultsGallery from "@/components/admin/ResultsGallery";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setEditingId(id);
    setSavingId(null);
  }, []);

  const handleSave = useCallback((id: string) => {
    setSavingId(id);
    setEditingId(null);
  }, []);

  const handleApplyEdit = useCallback(
    async (editPrompt: string) => {
      const item = history.find((h) => h.id === editingId);
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
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text.startsWith("{") ? JSON.parse(text).error : `Server error ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          const newItem: HistoryItem = {
            id: `${Date.now()}-gemini-edit`,
            parentId: item.id,
            provider: "gemini",
            base64: data.base64,
            mimeType: data.mimeType,
            durationMs: data.durationMs,
            prompt: `Edit: ${editPrompt}`,
          };
          setHistory((prev) => [newItem, ...prev]);
          setActiveId(newItem.id);
          setEditingId(newItem.id);
        } else {
          setError(`Edit failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        setError(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
      } finally {
        setEditLoading(false);
      }
    },
    [editingId, history]
  );

  const handleRemove = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (activeId === id) setActiveId(null);
    if (editingId === id) setEditingId(null);
    if (savingId === id) setSavingId(null);
  }, [activeId, editingId, savingId]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setActiveId(null);
    setEditingId(null);
    setSavingId(null);
  }, []);

  const editItem = history.find((h) => h.id === editingId);
  const saveItem = history.find((h) => h.id === savingId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-burgundy">Image Generator</h1>
        <p className="text-rose-gray text-sm mt-1">
          Generate product images using Gemini AI, optionally with a reference label design. Re-edit results and save to Cloudinary.
        </p>
      </div>

      {/* Prompt + controls */}
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

      {/* Results + inline edit/save panels */}
      <ResultsGallery
        history={history}
        activeId={activeId}
        onSelect={setActiveId}
        onEdit={handleEdit}
        onSave={handleSave}
        onRemove={handleRemove}
        onClearHistory={handleClearHistory}
        loading={loading}
        editing={editItem ? {
          defaultPrompt: editItem.prompt.startsWith("Edit: ") ? editItem.prompt.slice(6) : "",
          onApplyEdit: handleApplyEdit,
          onClose: () => setEditingId(null),
          loading: editLoading,
        } : null}
        saving={saveItem ? {
          imageBase64: saveItem.base64,
          imageMimeType: saveItem.mimeType,
          suggestedFilename: `${slugify(saveItem?.prompt || "candle-image")}-${Date.now().toString(36)}`,
          onClose: () => setSavingId(null),
        } : null}
      />
    </div>
  );
}
