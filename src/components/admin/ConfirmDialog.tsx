"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <h3 className="font-display text-lg text-burgundy">{title}</h3>
        <p className="text-charcoal text-sm">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-charcoal bg-rose-gray/10 rounded-lg hover:bg-rose-gray/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-blush bg-burgundy rounded-lg hover:bg-burgundy-light transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
