"use client";

import { useEffect, useState, useCallback } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { MediaImage } from "@/lib/admin/cloudinary";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function filename(publicId: string): string {
  return publicId.split("/").pop() || publicId;
}

export default function MediaLibraryPage() {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>();

  // Preview modal
  const [previewImage, setPreviewImage] = useState<MediaImage | null>(null);
  const [copied, setCopied] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<MediaImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchImages = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError("");
    try {
      const url = cursor ? `/api/admin/media?cursor=${cursor}` : "/api/admin/media";
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load images");
      }
      const data = await res.json();
      setImages(data.images);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function handleNext() {
    if (!nextCursor) return;
    setCursorStack((prev) => [...prev, currentCursor || ""]);
    setCurrentCursor(nextCursor);
    fetchImages(nextCursor);
  }

  function handlePrev() {
    if (cursorStack.length === 0) return;
    const prev = [...cursorStack];
    const prevCursor = prev.pop()!;
    setCursorStack(prev);
    setCurrentCursor(prevCursor || undefined);
    fetchImages(prevCursor || undefined);
  }

  async function handleCopyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS contexts
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: deleteTarget.publicId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setImages((prev) => prev.filter((img) => img.publicId !== deleteTarget.publicId));
      setPreviewImage(null);
      setDeleteTarget(null);
      showSuccess("Image deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-burgundy">Media Library</h1>
        <p className="text-rose-gray text-sm mt-1">
          Browse and manage images stored in Cloudinary.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Image grid */}
      {images.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-rose-gray/10 p-12 text-center text-rose-gray">
          No images found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.publicId}
              className="bg-white rounded-xl shadow-sm border border-rose-gray/10 overflow-hidden group"
            >
              <button
                onClick={() => setPreviewImage(img)}
                className="block w-full aspect-square bg-parchment/30 overflow-hidden cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={filename(img.publicId)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
              <div className="p-3 space-y-1">
                <p className="text-xs text-charcoal font-medium truncate" title={filename(img.publicId)}>
                  {filename(img.publicId)}
                </p>
                <div className="flex items-center justify-between text-xs text-rose-gray">
                  <span>{img.width}&times;{img.height}</span>
                  <span>{formatDate(img.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-rose-gray">{formatBytes(img.bytes)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(img);
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {(cursorStack.length > 0 || nextCursor) && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={cursorStack.length === 0 || loading}
            className="px-4 py-2 text-sm font-medium text-charcoal bg-rose-gray/10 rounded-lg
                       hover:bg-rose-gray/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs text-rose-gray">
            Page {cursorStack.length + 1}
          </span>
          <button
            onClick={handleNext}
            disabled={!nextCursor || loading}
            className="px-4 py-2 text-sm font-medium text-blush bg-burgundy rounded-lg
                       hover:bg-burgundy-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {loading && images.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-burgundy border-t-transparent" />
        </div>
      )}

      {/* Preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <img
                src={previewImage.url}
                alt={filename(previewImage.publicId)}
                className="w-full rounded-lg"
              />
            </div>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-charcoal">{filename(previewImage.publicId)}</p>
                <div className="flex flex-wrap gap-3 text-xs text-rose-gray">
                  <span>{previewImage.width}&times;{previewImage.height}</span>
                  <span>{previewImage.format.toUpperCase()}</span>
                  <span>{formatBytes(previewImage.bytes)}</span>
                  <span>{formatDate(previewImage.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopyUrl(previewImage.url)}
                  className="px-4 py-2 text-sm font-medium text-blush bg-burgundy rounded-lg
                             hover:bg-burgundy-light transition-colors"
                >
                  {copied ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(previewImage);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg
                             hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 text-sm font-medium text-charcoal bg-rose-gray/10 rounded-lg
                             hover:bg-rose-gray/20 transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Image"
        message={`Are you sure you want to delete "${deleteTarget ? filename(deleteTarget.publicId) : ""}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {deleting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-charcoal/30">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
        </div>
      )}
    </div>
  );
}
