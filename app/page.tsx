"use client"

import { useState } from "react"
import { ParticleCanvas } from "@/components/particle-canvas"
import { ControlPanel } from "@/components/control-panel"
import { MobileToggle } from "@/components/mobile-toggle"
import type { ParticleConfig } from "@/lib/particle-types"

export default function Home() {
  const [config, setConfig] = useState<ParticleConfig>({
    count: 150,
    speed: 1,
    size: 2,
    life: 100,
    gravity: 0.1,
    friction: 0.98,
    spread: 2,
    colorHue: 0,
    colorSaturation: 100,
    colorLightness: 50,
    trailLength: 15,
    explosiveForce: 5,
    emissionRate: 0.3,
    gridDensity: 150, // increased default gridDensity from 500 to 150 for densely packed particles
    waveAmplitude: 0.3,
    waveFrequency: 0.05,
    waveSpeed: 1,
    waveCount: 1,
    particleColor: "#ff00ff",
    backgroundColor: "#0a0a0a",
    backgroundGradient: "#1a1a2e",
    cameraAngle: 0,
    particleGlow: false,
  })

  const [showControls, setShowControls] = useState(false)

  return (
    <main className="w-full h-screen flex flex-col lg:flex-row bg-background text-foreground overflow-hidden">
      {/* Full-screen particle background */}
      <div className="flex-1 relative w-full h-full">
        <ParticleCanvas config={config} />

        {/* Mobile control toggle */}
        <div className="lg:hidden absolute bottom-4 right-4 z-50">
          <MobileToggle isOpen={showControls} onClick={() => setShowControls(!showControls)} />
        </div>
      </div>

      {/* Control panel */}
      <aside
        className={`fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto w-full lg:w-96 h-screen lg:h-screen bg-background/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border transition-transform duration-300 z-40 ${
          showControls ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        }`}
      >
        <ControlPanel config={config} onConfigChange={setConfig} onMobileClose={() => setShowControls(false)} />
      </aside>
    </main>
  )
}
