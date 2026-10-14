"use client";

/** Submit button that asks before deleting, so a quotation already sent to a customer isn't lost by a slip. */
export function DeleteButton({ label }: { label: string }) {
  return (
    <button
      onClick={(e) => {
        if (!confirm(`Delete ${label}? This cannot be undone.`)) e.preventDefault();
      }}
      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-bold text-red-700"
    >
      Delete this quotation
    </button>
  );
}
