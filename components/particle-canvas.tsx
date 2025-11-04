"use client"

import { useEffect, useRef } from "react"
import { ParticleEngine } from "@/lib/particle-engine"
import type { ParticleConfig } from "@/lib/particle-types"

export function ParticleCanvas({ config }: { config: ParticleConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const animationIdRef = useRef<number | null>(null)

  // Initialize canvas and animation loop ONCE
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const displayWidth = Math.floor(rect.width)
      const displayHeight = Math.floor(rect.height)
      
      // Only update if size actually changed to avoid unnecessary redraws
      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        // Set internal canvas size (actual pixels)
        canvas.width = displayWidth * dpr
        canvas.height = displayHeight * dpr
        
        // Reset transform and scale context to match device pixel ratio
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
        
        // Reinitialize grid if engine exists and size changed
        if (engineRef.current) {
          engineRef.current.resize()
        }
      }
    }
    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(canvas)

    if (!engineRef.current) {
      engineRef.current = new ParticleEngine(ctx, canvas)
    }

    const animate = () => {
      engineRef.current?.update()
      engineRef.current?.draw()
      animationIdRef.current = requestAnimationFrame(animate)
    }
    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      resizeObserver.disconnect()
    }
  }, []) // Only run once on mount

  // Update config separately without restarting animation
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig(config)
      const isGridMode = config.waveAmplitude > 0 && config.gridDensity > 0
      engineRef.current.setGridMode(isGridMode)
    }
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: config.backgroundColor,
        pointerEvents: "none",
      }}
    />
  )
}
