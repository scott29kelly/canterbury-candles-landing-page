"use client";

import { useState, useCallback } from "react";
import PromptInput from "@/components/admin/PromptInput";
import ResultsGallery from "@/components/admin/ResultsGallery";
import ImageEditor from "@/components/admin/ImageEditor";
import SaveImageDialog from "@/components/admin/SaveImageDialog";
import type { HistoryItem } from "@/components/admin/ImageCard";

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
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

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);

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
        alert(`Generation failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown"}`);
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

      try {
        const res = await fetch("/api/admin/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: item.base64,
            prompt: editPrompt,
          }),
        });

        const data = await res.json();

        if (data.success) {
          const newItem: HistoryItem = {
            id: `${Date.now()}-gemini-edit`,
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

      {/* Results */}
      <ResultsGallery
        history={history}
        activeId={activeId}
        onSelect={setActiveId}
        onEdit={handleEdit}
        onSave={handleSave}
        loading={loading}
      />

      {/* Editor panel */}
      {editItem && (
        <ImageEditor
          imageBase64={editItem.base64}
          imageMimeType={editItem.mimeType}
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
          suggestedFilename={`${slugify(saveItem?.prompt || "candle-image")}-${Date.now().toString(36)}`}
          onClose={() => setSavingId(null)}
        />
      )}
    </div>
  );
}
