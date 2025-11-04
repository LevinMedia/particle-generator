"use client"

import { Pencil, X } from "lucide-react"

export function MobileToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 rounded-lg bg-accent/80 hover:bg-accent/90 active:bg-accent text-accent-foreground border border-accent/50 transition-all duration-200 shadow-lg button-interactive focus-ring flex items-center gap-2"
      aria-label={isOpen ? "Close controls" : "Edit controls"}
      style={{
        minHeight: "44px",
      }}
    >
      {isOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <>
          <Pencil className="w-4 h-4" />
          <span className="text-sm font-mono font-medium">Edit</span>
        </>
      )}
    </button>
  )
}
