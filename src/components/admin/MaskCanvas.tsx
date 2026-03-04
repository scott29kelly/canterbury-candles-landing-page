"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface MaskCanvasHandle {
  exportMask: () => string | null;
  clearMask: () => void;
  invertMask: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface MaskCanvasProps {
  imageBase64: string;
  imageMimeType: string;
  tool: "brush" | "eraser";
  brushSize: number;
  maskColor?: string;
  showMask: boolean;
  zoom: number;
  onMaskChange: (hasMask: boolean) => void;
}

const DEFAULT_MASK_COLOR = "rgba(92, 36, 52, 0.45)";

/** Interpolate between two points to avoid gaps in fast strokes */
function interpolatePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  spacing: number
): { x: number; y: number }[] {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < spacing) return [{ x: x1, y: y1 }];
  const steps = Math.ceil(dist / spacing);
  const points: { x: number; y: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    points.push({ x: x0 + dx * t, y: y0 + dy * t });
  }
  return points;
}

/** Check if mask canvas has any painted pixels */
function hasMaskPixels(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) return true;
  }
  return false;
}

const MaskCanvas = forwardRef<MaskCanvasHandle, MaskCanvasProps>(function MaskCanvas(
  {
    imageBase64,
    imageMimeType,
    tool,
    brushSize,
    maskColor = DEFAULT_MASK_COLOR,
    showMask,
    zoom,
    onMaskChange,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Undo/redo stacks
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);
  const [undoLen, setUndoLen] = useState(0);
  const [redoLen, setRedoLen] = useState(0);

  // Load image and set canvas dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      loadedImageRef.current = img;
      setCanvasSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = `data:${imageMimeType};base64,${imageBase64}`;
  }, [imageBase64, imageMimeType]);

  // Draw image once canvases are mounted with correct dimensions
  useEffect(() => {
    const img = loadedImageRef.current;
    if (!img || !canvasSize.width) return;

    const ctx = imageCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
    }

    // Initialize undo stack with empty state
    const maskCtx = maskCanvasRef.current?.getContext("2d");
    if (maskCtx) {
      undoStack.current = [maskCtx.getImageData(0, 0, canvasSize.width, canvasSize.height)];
      redoStack.current = [];
      setUndoLen(0);
      setRedoLen(0);
    }
  }, [canvasSize]);

  // Update mask canvas visibility
  useEffect(() => {
    if (maskCanvasRef.current) {
      maskCanvasRef.current.style.opacity = showMask ? "1" : "0";
    }
  }, [showMask]);

  /** Convert pointer event coords to canvas coords */
  const getCanvasPos = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const canvas = cursorCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  /** Draw a brush circle at canvas coords */
  const drawBrush = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      if (tool === "brush") {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = maskColor;
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
      }
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    },
    [tool, brushSize, maskColor]
  );

  /** Save current mask state to undo stack */
  const pushUndo = useCallback(() => {
    const ctx = maskCanvasRef.current?.getContext("2d");
    if (!ctx || !canvasSize.width) return;
    const data = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
    undoStack.current.push(data);
    redoStack.current = [];
    setUndoLen(undoStack.current.length - 1);
    setRedoLen(0);
    onMaskChange(hasMaskPixels(ctx, canvasSize.width, canvasSize.height));
  }, [canvasSize, onMaskChange]);

  /** Draw cursor preview */
  const drawCursor = useCallback(
    (x: number, y: number) => {
      const ctx = cursorCanvasRef.current?.getContext("2d");
      if (!ctx || !canvasSize.width) return;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.strokeStyle = "#C8A951";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    },
    [brushSize, canvasSize]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const canvas = cursorCanvasRef.current;
      if (canvas) (canvas as HTMLCanvasElement).setPointerCapture(e.pointerId);

      isDrawing.current = true;
      const pos = getCanvasPos(e);
      lastPos.current = pos;

      const ctx = maskCanvasRef.current?.getContext("2d");
      if (ctx) drawBrush(ctx, pos.x, pos.y);
    },
    [getCanvasPos, drawBrush]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pos = getCanvasPos(e);
      drawCursor(pos.x, pos.y);

      if (!isDrawing.current || !lastPos.current) return;

      const ctx = maskCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      const points = interpolatePoints(
        lastPos.current.x,
        lastPos.current.y,
        pos.x,
        pos.y,
        Math.max(2, brushSize / 4)
      );
      for (const p of points) {
        drawBrush(ctx, p.x, p.y);
      }
      lastPos.current = pos;
    },
    [getCanvasPos, drawBrush, drawCursor, brushSize]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      pushUndo();
    }
  }, [pushUndo]);

  const handlePointerLeave = useCallback(() => {
    const ctx = cursorCanvasRef.current?.getContext("2d");
    if (ctx && canvasSize.width) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }
  }, [canvasSize]);

  // Imperative handle for parent
  useImperativeHandle(
    ref,
    () => ({
      get canUndo() {
        return undoStack.current.length > 1;
      },
      get canRedo() {
        return redoStack.current.length > 0;
      },

      exportMask() {
        const maskCtx = maskCanvasRef.current?.getContext("2d");
        if (!maskCtx || !canvasSize.width) return null;
        if (!hasMaskPixels(maskCtx, canvasSize.width, canvasSize.height)) return null;

        // OpenAI format: white background, transparent holes where user painted
        const temp = document.createElement("canvas");
        temp.width = canvasSize.width;
        temp.height = canvasSize.height;
        const ctx = temp.getContext("2d")!;

        // Fill white (opaque)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        // Punch transparent holes where mask was painted
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(maskCanvasRef.current!, 0, 0);

        // Return base64 without data URL prefix
        const dataUrl = temp.toDataURL("image/png");
        return dataUrl.split(",")[1];
      },

      clearMask() {
        const ctx = maskCanvasRef.current?.getContext("2d");
        if (!ctx || !canvasSize.width) return;
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        pushUndo();
        onMaskChange(false);
      },

      invertMask() {
        const ctx = maskCanvasRef.current?.getContext("2d");
        if (!ctx || !canvasSize.width) return;

        const imageData = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
        const data = imageData.data;

        // Parse mask color to get RGBA values
        const temp = document.createElement("canvas");
        temp.width = 1;
        temp.height = 1;
        const tCtx = temp.getContext("2d")!;
        tCtx.fillStyle = maskColor;
        tCtx.fillRect(0, 0, 1, 1);
        const [mr, mg, mb, ma] = tCtx.getImageData(0, 0, 1, 1).data;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            // Has paint → remove
            data[i + 3] = 0;
          } else {
            // No paint → add
            data[i] = mr;
            data[i + 1] = mg;
            data[i + 2] = mb;
            data[i + 3] = ma;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        pushUndo();
      },

      undo() {
        if (undoStack.current.length <= 1) return;
        const ctx = maskCanvasRef.current?.getContext("2d");
        if (!ctx) return;

        const current = undoStack.current.pop()!;
        redoStack.current.push(current);
        const prev = undoStack.current[undoStack.current.length - 1];
        ctx.putImageData(prev, 0, 0);

        setUndoLen(undoStack.current.length - 1);
        setRedoLen(redoStack.current.length);
        onMaskChange(hasMaskPixels(ctx, canvasSize.width, canvasSize.height));
      },

      redo() {
        if (redoStack.current.length === 0) return;
        const ctx = maskCanvasRef.current?.getContext("2d");
        if (!ctx) return;

        const next = redoStack.current.pop()!;
        undoStack.current.push(next);
        ctx.putImageData(next, 0, 0);

        setUndoLen(undoStack.current.length - 1);
        setRedoLen(redoStack.current.length);
        onMaskChange(hasMaskPixels(ctx, canvasSize.width, canvasSize.height));
      },
    }),
    [canvasSize, maskColor, pushUndo, onMaskChange, undoLen, redoLen]
  );

  const containerStyle: React.CSSProperties = {
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition: "transform 0.15s ease",
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={containerStyle}
    >
      {canvasSize.width > 0 && (
        <>
          <canvas
            ref={imageCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="block rounded-lg"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <canvas
            ref={maskCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute top-0 left-0 rounded-lg"
            style={{
              maxWidth: "100%",
              height: "auto",
              transition: "opacity 0.2s ease",
            }}
          />
          <canvas
            ref={cursorCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute top-0 left-0 rounded-lg"
            style={{
              maxWidth: "100%",
              height: "auto",
              cursor: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          />
        </>
      )}
    </div>
  );
});

export default MaskCanvas;
