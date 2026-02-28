"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { ProviderName } from "@/lib/admin/providers/types";

const PROVIDERS: { value: ProviderName; label: string }[] = [
  { value: "openai", label: "GPT Image 1" },
  { value: "gemini", label: "Gemini Pro" },
  { value: "seedream", label: "Seedream 4" },
];

interface Props {
  imageBase64: string;
  imageMimeType: string;
  defaultProvider: ProviderName;
  onApplyEdit: (provider: ProviderName, mask: string, prompt: string) => void;
  onClose: () => void;
  loading: boolean;
}

export default function ImageEditor({
  imageBase64,
  imageMimeType,
  defaultProvider,
  onApplyEdit,
  onClose,
  loading,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [provider, setProvider] = useState<ProviderName>(defaultProvider);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0 });
  const undoStackRef = useRef<ImageData[]>([]);

  // Load image and set up canvases
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      // Scale to fit container while preserving aspect ratio
      const maxW = containerRef.current?.clientWidth || 800;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;
      maskCanvas.width = w;
      maskCanvas.height = h;

      setImgDimensions({ w, h });

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      // Clear mask canvas
      const maskCtx = maskCanvas.getContext("2d")!;
      maskCtx.clearRect(0, 0, w, h);
    };
    img.src = `data:${imageMimeType};base64,${imageBase64}`;
  }, [imageBase64, imageMimeType]);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = maskCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const saveMaskState = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d")!;
    const data = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    undoStackRef.current.push(data);
    if (undoStackRef.current.length > 20) undoStackRef.current.shift();
  }, []);

  const drawAtPos = useCallback(
    (x: number, y: number) => {
      const maskCanvas = maskCanvasRef.current;
      if (!maskCanvas) return;
      const ctx = maskCanvas.getContext("2d")!;

      ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();
    },
    [brushSize, isErasing]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      saveMaskState();
      setDrawing(true);
      const pos = getPos(e);
      drawAtPos(pos.x, pos.y);
    },
    [saveMaskState, getPos, drawAtPos]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      drawAtPos(pos.x, pos.y);
    },
    [drawing, getPos, drawAtPos]
  );

  const handlePointerUp = useCallback(() => {
    setDrawing(false);
  }, []);

  const handleUndo = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || undoStackRef.current.length === 0) return;
    const ctx = maskCanvas.getContext("2d")!;
    const prev = undoStackRef.current.pop()!;
    ctx.putImageData(prev, 0, 0);
  };

  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    saveMaskState();
    const ctx = maskCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  };

  const getMaskBase64 = (): string => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return "";

    // Create a clean mask: white where painted, transparent (black) elsewhere
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext("2d")!;

    const maskCtx = maskCanvas.getContext("2d")!;
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const outData = tempCtx.createImageData(maskCanvas.width, maskCanvas.height);

    for (let i = 0; i < maskData.data.length; i += 4) {
      // If there's any paint (alpha > 0), make it white; otherwise black
      if (maskData.data[i + 3] > 0) {
        outData.data[i] = 255;     // R
        outData.data[i + 1] = 255; // G
        outData.data[i + 2] = 255; // B
        outData.data[i + 3] = 255; // A
      } else {
        outData.data[i] = 0;
        outData.data[i + 1] = 0;
        outData.data[i + 2] = 0;
        outData.data[i + 3] = 255;
      }
    }
    tempCtx.putImageData(outData, 0, 0);

    return tempCanvas.toDataURL("image/png").split(",")[1];
  };

  const handleApply = () => {
    const mask = getMaskBase64();
    onApplyEdit(provider, mask, editPrompt);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-rose-gray/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-burgundy">Edit Image</h3>
        <button
          onClick={onClose}
          className="text-rose-gray hover:text-charcoal transition-colors text-xl leading-none"
        >
          &times;
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-charcoal">Brush:</span>
          <input
            type="range"
            min={5}
            max={80}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-rose-gray w-8">{brushSize}px</span>
        </label>

        <button
          onClick={() => setIsErasing(!isErasing)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            isErasing
              ? "bg-red-100 text-red-700"
              : "bg-burgundy/10 text-burgundy"
          }`}
        >
          {isErasing ? "Erasing" : "Painting"}
        </button>

        <button
          onClick={handleUndo}
          className="px-3 py-1 rounded text-xs bg-rose-gray/10 text-charcoal hover:bg-rose-gray/20 transition-colors"
        >
          Undo
        </button>

        <button
          onClick={handleClearMask}
          className="px-3 py-1 rounded text-xs bg-rose-gray/10 text-charcoal hover:bg-rose-gray/20 transition-colors"
        >
          Clear Mask
        </button>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="relative inline-block overflow-hidden rounded-lg border border-rose-gray/20">
        <canvas ref={canvasRef} className="block" />
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0"
          style={{
            width: imgDimensions.w || "100%",
            height: imgDimensions.h || "100%",
            cursor: `crosshair`,
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>

      <p className="text-xs text-rose-gray">
        Paint over the region you want to edit. For Gemini, only the prompt is used (no mask).
      </p>

      {/* Edit prompt */}
      <textarea
        value={editPrompt}
        onChange={(e) => setEditPrompt(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-rose-gray/30 rounded-lg text-charcoal resize-y
                   focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
        placeholder="Describe the edit you want to make to the painted region..."
      />

      {/* Provider + Apply */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              onClick={() => setProvider(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                provider === p.value
                  ? "bg-burgundy text-blush"
                  : "bg-white border border-rose-gray/30 text-charcoal hover:border-burgundy/40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleApply}
          disabled={loading || !editPrompt.trim()}
          className="ml-auto px-6 py-2 bg-burgundy text-blush rounded-lg font-medium
                     hover:bg-burgundy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Applying..." : "Apply Edit"}
        </button>
      </div>
    </div>
  );
}
