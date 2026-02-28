"use client";

import { useState, useCallback } from "react";
import type { ProviderName } from "@/lib/admin/providers/types";
import PromptInput from "@/components/admin/PromptInput";
import ResultsGallery from "@/components/admin/ResultsGallery";
import ImageEditor from "@/components/admin/ImageEditor";
import SaveImageDialog from "@/components/admin/SaveImageDialog";
import type { HistoryItem } from "@/components/admin/ImageCard";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("square");
  const [provider, setProvider] = useState<ProviderName>("openai");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<ProviderName | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setLoadingProvider(provider);

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, prompt, size }),
      });

      const data = await res.json();

      if (data.success) {
        const item: HistoryItem = {
          id: `${Date.now()}-${data.provider}`,
          provider: data.provider,
          base64: data.base64,
          mimeType: data.mimeType,
          durationMs: data.durationMs,
          prompt,
        };
        setHistory((prev) => [item, ...prev]);
        setActiveId(item.id);
      } else {
        alert(`Generation failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  }, [prompt, size, provider, loading]);

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
    setSavingId(null);
  }, []);

  const handleSave = useCallback((id: string) => {
    setSavingId(id);
    setEditingId(null);
  }, []);

  const handleApplyEdit = useCallback(
    async (editProvider: ProviderName, mask: string, editPrompt: string) => {
      const item = history.find((h) => h.id === editingId);
      if (!item) return;

      setEditLoading(true);

      try {
        const res = await fetch("/api/admin/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: editProvider,
            image: item.base64,
            mask,
            prompt: editPrompt,
          }),
        });

        const data = await res.json();

        if (data.success) {
          const newItem: HistoryItem = {
            id: `${Date.now()}-${data.provider}-edit`,
            provider: data.provider,
            base64: data.base64,
            mimeType: data.mimeType,
            durationMs: data.durationMs,
            prompt: `Edit: ${editPrompt}`,
          };
          setHistory((prev) => [newItem, ...prev]);
          setActiveId(newItem.id);
          setEditingId(newItem.id);
        } else {
          alert(`Edit failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        alert(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
      } finally {
        setEditLoading(false);
      }
    },
    [editingId, history]
  );

  const activeItem = history.find((h) => h.id === activeId);
  const editItem = history.find((h) => h.id === editingId);
  const saveItem = history.find((h) => h.id === savingId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-burgundy">Image Generator</h1>
        <p className="text-rose-gray text-sm mt-1">
          Generate product images using AI, compare results, edit via inpainting, and save to Cloudinary.
        </p>
      </div>

      {/* Prompt + controls */}
      <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-4">
        <PromptInput
          prompt={prompt}
          onPromptChange={setPrompt}
          size={size}
          onSizeChange={setSize}
          provider={provider}
          onProviderChange={setProvider}
          onGenerate={handleGenerate}
          loading={loading}
        />
      </div>

      {/* Results */}
      <ResultsGallery
        history={history}
        activeId={activeId}
        onSelect={setActiveId}
        onEdit={handleEdit}
        onSave={handleSave}
        loading={loading}
        loadingProvider={loadingProvider}
      />

      {/* Editor panel */}
      {editItem && (
        <ImageEditor
          imageBase64={editItem.base64}
          imageMimeType={editItem.mimeType}
          defaultProvider={editItem.provider}
          onApplyEdit={handleApplyEdit}
          onClose={() => setEditingId(null)}
          loading={editLoading}
        />
      )}

      {/* Save dialog */}
      {saveItem && (
        <SaveImageDialog
          imageBase64={saveItem.base64}
          imageMimeType={saveItem.mimeType}
          suggestedFilename={slugify(activeItem?.prompt || "candle-image")}
          onClose={() => setSavingId(null)}
        />
      )}
    </div>
  );
}
