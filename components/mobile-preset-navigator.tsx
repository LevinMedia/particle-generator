"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ParticleConfig } from "@/lib/particle-types"
import { presets } from "@/lib/presets"

interface MobilePresetNavigatorProps {
  config: ParticleConfig
  onConfigChange: (config: ParticleConfig) => void
}

export function MobilePresetNavigator({ config, onConfigChange }: MobilePresetNavigatorProps) {
  // Find current preset index
  const getCurrentPresetIndex = () => {
    return presets.findIndex((p) => JSON.stringify(p.config) === JSON.stringify(config))
  }

  const currentIndex = getCurrentPresetIndex()
  const currentPreset = currentIndex >= 0 ? presets[currentIndex] : null

  const goToPrevious = () => {
    if (currentIndex >= 0) {
      const prevIndex = currentIndex === 0 ? presets.length - 1 : currentIndex - 1
      const preset = presets[prevIndex]
      onConfigChange(preset.config)
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${preset.id}`)
      }
    } else {
      // If no preset matches, go to first preset
      const preset = presets[0]
      onConfigChange(preset.config)
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${preset.id}`)
      }
    }
  }

  const goToNext = () => {
    if (currentIndex >= 0) {
      const nextIndex = currentIndex === presets.length - 1 ? 0 : currentIndex + 1
      const preset = presets[nextIndex]
      onConfigChange(preset.config)
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${preset.id}`)
      }
    } else {
      // If no preset matches, go to first preset
      const preset = presets[0]
      onConfigChange(preset.config)
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${preset.id}`)
      }
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/20 border border-accent/30 shadow-lg">
      <button
        onClick={goToPrevious}
        className="p-2 hover:bg-accent/30 active:bg-accent/40 text-accent transition-all duration-200 rounded button-interactive focus-ring flex-shrink-0"
        aria-label="Previous preset"
        style={{
          minHeight: "44px",
          minWidth: "44px",
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex-1 text-center px-2">
        <span className="text-sm font-mono text-accent">
          {currentPreset ? currentPreset.name : "Custom"}
        </span>
      </div>

      <button
        onClick={goToNext}
        className="p-2 hover:bg-accent/30 active:bg-accent/40 text-accent transition-all duration-200 rounded button-interactive focus-ring flex-shrink-0"
        aria-label="Next preset"
        style={{
          minHeight: "44px",
          minWidth: "44px",
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

