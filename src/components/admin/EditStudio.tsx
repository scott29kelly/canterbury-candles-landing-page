"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";
import MaskCanvas from "./MaskCanvas";
import type { MaskCanvasHandle } from "./MaskCanvas";
import type { HistoryItem } from "./ImageCard";

interface EditStudioProps {
  item: HistoryItem;
  onApplyEdit: (prompt: string, mask: string | null, provider: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function EditStudio({
  item,
  onApplyEdit,
  onClose,
  loading,
}: EditStudioProps) {
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(24);
  const [showMask, setShowMask] = useState(true);
  const [editPrompt, setEditPrompt] = useState("");
  const [hasMask, setHasMask] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<MaskCanvasHandle>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const provider = hasMask ? "gpt-image" : "gemini";

  const handleApply = useCallback(() => {
    if (loading || !editPrompt.trim()) return;
    const mask = canvasRef.current?.exportMask() ?? null;
    onApplyEdit(editPrompt, mask, provider);
  }, [editPrompt, loading, onApplyEdit, provider]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't intercept when typing in textarea
      const tag = (e.target as HTMLElement)?.tagName;
      const inInput = tag === "TEXTAREA" || tag === "INPUT";

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleApply();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        canvasRef.current?.redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        canvasRef.current?.undo();
        return;
      }

      if (inInput) return;

      if (e.key.toLowerCase() === "b") {
        setTool("brush");
      } else if (e.key.toLowerCase() === "e") {
        setTool("eraser");
      } else if (e.key === "[") {
        setBrushSize((s) => Math.max(4, s - 4));
      } else if (e.key === "]") {
        setBrushSize((s) => Math.min(80, s + 4));
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, handleApply]);

  // Shift+scroll for zoom
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (!e.shiftKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(3, Math.max(0.5, z + (e.deltaY > 0 ? -0.1 : 0.1))));
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden shadow-lg border border-rose-gray/10"
      style={{ backgroundColor: "#2D2226" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <h2 className="font-display text-lg text-blush">Edit Studio</h2>
        <button
          onClick={onClose}
          className="text-blush/60 hover:text-blush transition-colors text-xl leading-none px-1"
        >
          &times;
        </button>
      </div>

      {/* Main content: tool strip | canvas | controls */}
      <div className="grid grid-cols-[48px_1fr_320px] min-h-[400px]">
        {/* Tool strip */}
        <div className="flex flex-col items-center gap-1 py-3 border-r border-white/10">
          <ToolButton
            icon={<BrushIcon />}
            label="Brush (B)"
            active={tool === "brush"}
            onClick={() => setTool("brush")}
          />
          <ToolButton
            icon={<EraserIcon />}
            label="Eraser (E)"
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
          />

          <div className="w-6 border-t border-white/10 my-1" />

          <ToolButton
            icon={<UndoIcon />}
            label="Undo (Ctrl+Z)"
            active={false}
            onClick={() => canvasRef.current?.undo()}
          />
          <ToolButton
            icon={<RedoIcon />}
            label="Redo (Ctrl+Shift+Z)"
            active={false}
            onClick={() => canvasRef.current?.redo()}
          />

          <div className="w-6 border-t border-white/10 my-1" />

          <ToolButton
            icon={<TrashIcon />}
            label="Clear mask"
            active={false}
            onClick={() => canvasRef.current?.clearMask()}
          />
        </div>

        {/* Canvas area */}
        <div className="flex flex-col items-center justify-center p-4 overflow-auto">
          <div className="max-h-[60vh] flex items-center justify-center">
            <MaskCanvas
              ref={canvasRef}
              imageBase64={item.base64}
              imageMimeType={item.mimeType}
              tool={tool}
              brushSize={brushSize}
              showMask={showMask}
              zoom={zoom}
              onMaskChange={setHasMask}
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="w-7 h-7 rounded bg-white/10 text-blush/80 hover:bg-white/20 transition-colors text-sm flex items-center justify-center"
            >
              -
            </button>
            <span className="text-blush/60 text-xs w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="w-7 h-7 rounded bg-white/10 text-blush/80 hover:bg-white/20 transition-colors text-sm flex items-center justify-center"
            >
              +
            </button>
            <button
              onClick={() => setZoom(1)}
              className="text-blush/40 text-xs hover:text-blush/70 transition-colors ml-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Controls panel */}
        <div className="border-l border-white/10 p-4 flex flex-col gap-4 bg-[#3A2A2E]">
          {/* Edit prompt */}
          <div>
            <label className="block text-xs font-medium text-blush/70 mb-1">
              Edit prompt
            </label>
            <textarea
              ref={promptRef}
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-blush text-sm
                         resize-y focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold
                         placeholder:text-blush/30"
              placeholder="Describe the edit..."
            />
            <p className="text-blush/30 text-[10px] mt-0.5">Ctrl+Enter to apply</p>
          </div>

          {/* Provider indicator */}
          <div
            className="rounded-lg px-3 py-2.5 text-sm transition-all duration-300"
            style={{
              backgroundColor: hasMask ? "rgba(92,36,52,0.3)" : "rgba(200,169,81,0.15)",
            }}
          >
            {hasMask ? (
              <div className="flex items-center gap-2 text-blush">
                <PaintIcon />
                <div>
                  <p className="font-medium text-xs">GPT Image</p>
                  <p className="text-blush/50 text-[10px]">Targeted inpaint</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gold">
                <SparkleIcon />
                <div>
                  <p className="font-medium text-xs">Gemini</p>
                  <p className="text-gold/50 text-[10px]">Full re-edit</p>
                </div>
              </div>
            )}
          </div>

          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={loading || !editPrompt.trim()}
            className="w-full py-2.5 bg-burgundy text-blush rounded-lg font-medium text-sm
                       hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Applying..." : "Apply Edit"}
          </button>

          {/* Brush size slider */}
          <div>
            <label className="block text-xs font-medium text-blush/70 mb-1">
              Brush size
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={4}
                max={80}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1 accent-gold h-1"
              />
              <span className="text-blush/60 text-xs w-10 text-right">{brushSize}px</span>
            </div>
          </div>

          {/* Mask controls */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-blush/70">
              Mask
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMask(true)}
                className={`flex-1 py-1.5 rounded text-xs transition-colors ${
                  showMask
                    ? "bg-white/20 text-blush"
                    : "bg-white/5 text-blush/40 hover:bg-white/10"
                }`}
              >
                Show
              </button>
              <button
                onClick={() => setShowMask(false)}
                className={`flex-1 py-1.5 rounded text-xs transition-colors ${
                  !showMask
                    ? "bg-white/20 text-blush"
                    : "bg-white/5 text-blush/40 hover:bg-white/10"
                }`}
              >
                Hide
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => canvasRef.current?.invertMask()}
                className="flex-1 py-1.5 bg-white/5 text-blush/60 rounded text-xs hover:bg-white/10 transition-colors"
              >
                Invert
              </button>
              <button
                onClick={() => canvasRef.current?.clearMask()}
                className="flex-1 py-1.5 bg-white/5 text-blush/60 rounded text-xs hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Shortcut hints */}
          <div className="mt-auto pt-2 border-t border-white/10">
            <p className="text-blush/25 text-[10px] leading-relaxed">
              B brush &middot; E eraser &middot; [ ] size &middot; Ctrl+Z undo &middot; Ctrl+Shift+Z redo &middot; Esc close
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Tool button ── */

function ToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
        active
          ? "bg-gold/20 text-gold"
          : "text-blush/40 hover:text-blush/70 hover:bg-white/5"
      }`}
    >
      {icon}
    </button>
  );
}

/* ── SVG Icons ── */

function BrushIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
      <path d="M14.5 17.5 4.5 15" />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function PaintIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <path d="M17 2 A5.5 5.5 0 0 1 17 13 L7 13 A5 5 0 0 0 7 22 L7 22 A12 12 0 0 1 7 2 Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}
