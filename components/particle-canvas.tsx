"use client"

import { useEffect, useRef } from "react"
import { ParticleEngine } from "@/lib/particle-engine"
import type { ParticleConfig } from "@/lib/particle-types"

export function ParticleCanvas({ config }: { config: ParticleConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize()
    })
    resizeObserver.observe(canvas)

    if (!engineRef.current) {
      engineRef.current = new ParticleEngine(ctx, canvas)
    }

    engineRef.current.config = config
    const isGridMode = config.waveAmplitude > 0 && config.gridDensity > 0
    engineRef.current.setGridMode(isGridMode)

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
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: config.backgroundColor,
      }}
    />
  )
}
