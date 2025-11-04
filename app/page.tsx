"use client"

import { useState } from "react"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ControlPanel } from "@/components/control-panel"
import { MobileToggle } from "@/components/mobile-toggle"
import { MobilePresetNavigator } from "@/components/mobile-preset-navigator"
import type { ParticleConfig } from "@/lib/particle-types"

export default function Home() {
  const [config, setConfig] = useState<ParticleConfig>({
    size: 1,
    gridDensity: 233,
    waveAmplitude: 0.95,
    waveFrequency: 0.01,
    waveSpeed: 0.1,
    waveCount: 1,
    waveDirection: 229,
    cameraRoll: 0,
    cameraPitch: -6,
    cameraAltitude: 240,
    colorMode: "solid",
    particleColor: "#ff00ff",
    peakColor: "#00ffff",
    troughColor: "#ff00ff",
    backgroundColor: "#0a0a0a",
    backgroundGradient: "#1a1a2e",
  })

  const [showControls, setShowControls] = useState(false)

  return (
    <main className="w-full h-screen flex flex-col lg:flex-row bg-background text-foreground overflow-hidden">
      {/* Full-screen particle background */}
      <div className="flex-1 relative w-full h-full overflow-hidden min-h-0">
        <ParticleCanvas config={config} />
      </div>

      {/* Mobile controls - fixed to viewport */}
      {!showControls && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center gap-2 px-4 pt-4 pointer-events-none" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="flex-1 pointer-events-auto">
            <MobilePresetNavigator config={config} onConfigChange={setConfig} />
          </div>
          <div className="pointer-events-auto">
            <MobileToggle isOpen={showControls} onClick={() => setShowControls(!showControls)} />
          </div>
        </div>
      )}

      {/* Control panel */}
      <aside
        className={`fixed lg:relative bottom-0 lg:bottom-auto left-0 right-0 lg:left-auto lg:right-auto lg:top-auto w-full lg:w-96 mobile-drawer-height lg:h-screen bg-background/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border transition-transform duration-300 z-40 overflow-hidden ${
          showControls ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        }`}
      >
        <ControlPanel config={config} onConfigChange={setConfig} onMobileClose={() => setShowControls(false)} />
      </aside>
    </main>
  )
}
