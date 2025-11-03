"use client"

import { Menu, X } from "lucide-react"

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
      className="p-3 rounded-lg bg-accent/20 hover:bg-accent/30 active:bg-accent/40 text-accent border border-accent/30 transition-all duration-200 shadow-lg button-interactive focus-ring"
      aria-label={isOpen ? "Close controls" : "Open controls"}
      style={{
        minHeight: "44px",
        minWidth: "44px",
      }}
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  )
}
