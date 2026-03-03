"use client";

import ImageCard from "./ImageCard";
import type { HistoryItem } from "./ImageCard";

interface Props {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onRemove: (id: string) => void;
  onClearHistory: () => void;
}

export default function ResultsGallery({
  history,
  activeId,
  onSelect,
  onEdit,
  onSave,
  onRemove,
  onClearHistory,
}: Props) {
  if (history.length === 0) return null;

  return (
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
      <div
        className={
          history.length > 8
            ? "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2"
            : "flex gap-2 overflow-x-auto pb-2"
        }
      >
        {history.map((item) => (
          <div
            key={item.id}
            className={history.length > 8 ? "w-full" : "flex-shrink-0 w-24"}
          >
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
  );
}
