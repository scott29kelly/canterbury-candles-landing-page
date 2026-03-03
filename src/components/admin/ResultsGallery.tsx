"use client";

import { useState, useEffect, useCallback } from "react";
import ImageCard from "./ImageCard";
import type { HistoryItem } from "./ImageCard";
import SaveImageDialog from "./SaveImageDialog";

function InlineEditPanel({ editing }: { editing: EditingState }) {
  const [editPrompt, setEditPrompt] = useState(editing.defaultPrompt);

  const handleSubmit = useCallback(() => {
    if (!editing.loading && editPrompt.trim()) {
      editing.onApplyEdit(editPrompt);
    }
  }, [editing, editPrompt]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-4 flex flex-col h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg text-burgundy">Re-edit Image</h3>
        <button
          onClick={editing.onClose}
          className="text-rose-gray hover:text-charcoal transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>
      <textarea
        value={editPrompt}
        onChange={(e) => setEditPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        rows={5}
        className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal resize-y
                   focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold mb-3"
        placeholder="Describe the edit you want (e.g. 'make the background warmer', 'add soft bokeh')..."
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={editing.loading || !editPrompt.trim()}
          className="px-6 py-2 bg-burgundy text-blush rounded-lg font-medium
                     hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {editing.loading ? "Applying..." : "Apply Edit"}
        </button>
        <span className="text-xs text-rose-gray/60">Ctrl+Enter</span>
      </div>
    </div>
  );
}

interface EditingState {
  defaultPrompt: string;
  onApplyEdit: (prompt: string) => void;
  onClose: () => void;
  loading: boolean;
}

interface SavingState {
  imageBase64: string;
  imageMimeType: string;
  suggestedFilename: string;
  onClose: () => void;
}

interface Props {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onRemove: (id: string) => void;
  onClearHistory: () => void;
  loading: boolean;
  editing?: EditingState | null;
  saving?: SavingState | null;
}

export default function ResultsGallery({
  history,
  activeId,
  onSelect,
  onEdit,
  onSave,
  onRemove,
  onClearHistory,
  loading,
  editing,
  saving,
}: Props) {
  const activeItem = history.find((h) => h.id === activeId);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!loading) {
      setElapsedSeconds(0);
      return;
    }
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  if (!activeItem && !loading && history.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-rose-gray/30 p-12 text-center">
        <p className="text-rose-gray text-lg">No images generated yet</p>
        <p className="text-rose-gray/60 text-sm mt-1">
          Enter a prompt and click Generate to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main display — active image or loading state, with optional inline edit panel */}
      <div className={editing ? "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4" : ""}>
        <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-rose-gray/10">
          {loading && !activeItem ? (
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
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${activeItem.mimeType};base64,${activeItem.base64}`}
                alt="Generated candle image"
                className="w-full max-h-[512px] object-contain mx-auto"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-xs bg-charcoal/70 text-white px-2 py-1 rounded-full">
                  Gemini
                </span>
                <span className="text-xs bg-charcoal/70 text-white px-2 py-1 rounded-full">
                  {(activeItem.durationMs / 1000).toFixed(1)}s
                </span>
              </div>
              {loading && (
                <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-burgundy/30 border-t-burgundy rounded-full animate-spin" />
                  <p className="mt-3 text-charcoal text-sm font-medium">
                    Generating... ({elapsedSeconds}s)
                  </p>
                </div>
              )}
              <div className="flex gap-2 p-3 border-t border-rose-gray/10">
                <button
                  onClick={() => onEdit(activeItem.id)}
                  className="px-4 py-2 bg-burgundy/10 text-burgundy rounded-lg text-sm hover:bg-burgundy/20 transition-colors"
                >
                  Re-edit
                </button>
                <button
                  onClick={() => onSave(activeItem.id)}
                  className="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition-colors font-medium"
                >
                  Save to Cloudinary
                </button>
              </div>
              {/* Inline save panel */}
              {saving && (
                <div className="px-3 pb-3">
                  <SaveImageDialog
                    imageBase64={saving.imageBase64}
                    imageMimeType={saving.imageMimeType}
                    suggestedFilename={saving.suggestedFilename}
                    onClose={saving.onClose}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Inline edit panel */}
        {editing && (
          <InlineEditPanel editing={editing} />
        )}
      </div>

      {/* Thumbnail strip / grid */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-charcoal">
              Generation History ({history.length})
            </h3>
            <button
              onClick={onClearHistory}
              className="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className={
            history.length > 8
              ? "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2"
              : "flex gap-2 overflow-x-auto pb-2"
          }>
            {history.map((item) => (
              <div key={item.id} className={history.length > 8 ? "w-full" : "flex-shrink-0 w-24"}>
                <ImageCard
                  item={item}
                  isActive={item.id === activeId}
                  onClick={() => onSelect(item.id)}
                  onEdit={() => onEdit(item.id)}
                  onSave={() => onSave(item.id)}
                  onRemove={() => onRemove(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
